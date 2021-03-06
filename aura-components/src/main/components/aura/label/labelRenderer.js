/*
 * Copyright (C) 2013 salesforce.com, inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
({
    render: function(component, helper){
        var base = component.get('v.value');
        var vPattern = new RegExp("\\{(0|[1-9][0-9]*)\\}"); // match {#}
        var vEndPattern = new RegExp("\\}"); // match }
        if (!(base && base.search(vPattern) > -1)) { // nothing to replace
            return document.createTextNode(base);
        }

        var body = component.get("v.body");
        if (body && body.length > 0) { // render the body content to components
            var items = [];
            for (var i = 0; i < body.length; i++) {
                var child = body[i];
                if (child.getDef().getDescriptor().getQualifiedName() === "markup://aura:text") {
                    continue;
                }
                
                items.push($A.render(child));
            }

            if (items.length > 0) { // we have something to replace
                var itemUsed = [];
                var elems = helper.tokenize(base, vPattern, vEndPattern);
                var results = [];
                for (var j = 0; j < elems.length; j++) {
                    var el = elems[j];
                    if (typeof el == "number") {// something we should replace
                        var sub = items[el];
                        if (!sub) {
                            // there was nothing passed in to substitute
                            sub = document.createTextNode("{" + el + "}");
                        }
                        if(!aura.util.isArray(sub)){
                            sub = [sub];
                        }
                        if (itemUsed[el] === true) {
                            for (var k = 0; k < sub.length; k++) {
                                results.push(sub[k].cloneNode(true));  // insert a copy of the node, since appendChild cannot add the same node more than once.
                            }
                        } else {
                            for (var n = 0; n < sub.length; n++) {
                                results.push(sub[n]);
                            }
                            itemUsed[el] = true;
                        }
                    } else { // text
                        results.push(document.createTextNode(el));
                    }
                }
                return results;
            }
        }

        return document.createTextNode(base);
    },

    rerender: function(component){
        var body = component.get("v.body");
        for (var i = 0; i < body.length; i++) {
            var child = body[i];
            if (child.isRendered()) {
                $A.rerender(child);
            }
        }
    },

    afterRender: function(component) {
        var body = component.get("v.body");
        for (var i = 0; i < body.length; i++) {
            var child = body[i];
            if (child.isRendered()) {
                $A.afterRender(child);
            }
        }
    }
})
