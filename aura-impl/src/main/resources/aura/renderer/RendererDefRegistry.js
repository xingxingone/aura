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
/**
 * @description A registry for RendererDefs.
 * @constructor
 * @protected
 */
/*jslint sub: true*/
function RendererDefRegistry(){
    this.rendererDefs = {};
}

RendererDefRegistry.prototype.auraType = "RendererDefRegistry";

/**
 * Returns a RendererDef instance or config after adding to the registry.
 * Throws an error if componentDefDescriptor is not provided.
 * @param {Object} componentDefDescriptor Required. The component definition descriptor to lookup on the providerDefs.
 * @param {Object} config Passes in a config, ComponentDef, or the name of a ComponentDef.
 */
RendererDefRegistry.prototype.getDef = function(componentDefDescriptor){
    aura.assert(componentDefDescriptor, "ComponentDef Descriptor is required");
    var ret = this.rendererDefs[componentDefDescriptor];
    if(!ret){
        ret = new RendererDef(componentDefDescriptor.getQualifiedName());
        this.rendererDefs[componentDefDescriptor] = ret;
    }
    return ret;
};

Aura.Renderer.RendererDefRegistry = RendererDefRegistry;