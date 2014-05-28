package org.auraframework.test.perf;

import org.auraframework.test.SauceUtil;
import org.auraframework.test.perf.core.AbstractPerfTestCase;
import org.auraframework.test.perf.metrics.PerfMetrics;
import org.auraframework.test.perf.metrics.PerfMetricsComparator;
import org.openqa.selenium.By;

/**
 * Checks that the metrics we measure are the expected ones. The idea is to measure the metrics manually, input the
 * values in this test class and then have this test class verify that our automated ways of getting the metrics get the
 * exact same values.
 */
public final class PerfMetricsTest extends AbstractPerfTestCase {

    public PerfMetricsTest(String name) {
        super(name);
    }

    private static final String LABEL_MOCK = "Mock value for 'label' attribute";

    @Override
    protected int numPerfAuraRuns() {
        return getName().equals("testButton") ? 1 : 0;
    }

    /**
     * Overriding to check the expected metrics are meaused
     */
    @Override
    protected void perfTearDown(PerfMetrics actual) throws Exception {
        String testName = getName();
        if (testName.equals("testButton")) {
            verifyButton(actual);
        } else if (testName.equals("testLabel")) {
            verifyLabel(actual);
        } else if (testName.equals("testDummyPerf")) {
            verifyDummyPerf(actual);
        } else {
            fail("TODO: " + testName + ": " + actual.toLongString());
        }
    }

    // ui:button: basic simple ref case

    /**
     * Test loading component using /perfTest/perf.app
     */
    public void testButton() throws Exception {
        runWithPerfApp(getDefDescriptor("ui:button"));
    }

    private void verifyButton(PerfMetrics actual) {
        PerfMetrics expected = new PerfMetrics();
        // Timeline metrics
        expected.setMetric("Timeline.Rendering.Layout", 2);
        expected.setMetric("Timeline.Painting.Paint", 2); // button + image
        // Aura Stats metrics:
        expected.setMetric("Aura.CreateComponent.component.added", 9);
        expected.setMetric("Aura.RenderComponent.rerender.removed", 0);
        assertMetrics(expected, actual);

        // verify the component was loaded
        assertEquals("button loaded", LABEL_MOCK, currentDriver.findElement(By.cssSelector(".uiButton")).getText());

        // TODO: check network metrics
        // MedianPerfMetric networkMetric = (MedianPerfMetric) median.getMetric("Network.encodedDataLength");
    }

    // ui:label: perf.app was not showing the label in the page

    public void testLabel() throws Exception {
        runWithPerfApp(getDefDescriptor("ui:label"));
    }

    private void verifyLabel(PerfMetrics actual) {
        // check expected metrics
        PerfMetrics expected = new PerfMetrics();
        expected.setMetric("Timeline.Rendering.Layout", 1);
        expected.setMetric("Timeline.Painting.Paint", 1);
        assertMetrics(expected, actual);

        // verify the component was loaded
        assertEquals("label loaded", LABEL_MOCK,
                currentDriver.findElement(By.cssSelector(".uiLabel")).getText());
    }

    // perf:dummyPerf

    /**
     * Verifies that we report at least 10 paints for the dummyPerf.cmp
     */
    public void testDummyPerf() throws Exception {
        runWithPerfApp(getDefDescriptor("perf:dummyPerf"));
    }

    private void verifyDummyPerf(PerfMetrics actual) {
        if (!SauceUtil.areTestsRunningOnSauce()) {
            logger.warning("skipping test because not running in SauceLabs: " + getName());
            return;
        }
        PerfMetrics expected = new PerfMetrics();
        expected.setMetric("Timeline.Rendering.Layout", 2);
        expected.setMetric("Timeline.Painting.Paint", 3);
        assertMetrics(expected, actual);
    }

    // util

    private void assertMetrics(PerfMetrics expected, PerfMetrics actual) {
        String differentMessage = new PerfMetricsComparator(null).compare(expected, actual);
        if (differentMessage != null) {
            fail(differentMessage);
        }
    }
}
