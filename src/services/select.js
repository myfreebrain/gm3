/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016-2017 Dan "Ducky" Little
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/** Select Service.
 *
 *  Used to select a set of features using a given geometry.
 *
 */
function SelectService(Application, options) {
    /** Define the title of the service. */
    this.title = options.title ? options.title : 'Select';

    /** Title to show at the top of the results. */
    this.resultsTitle = options.resultsTitle ? options.resultsTitle : 'Select Results';

    /** Template to use for rendering returned features. */
    this.template = options.template ? options.template : '@select';

    /** Name will be set by the application when the service is registered. */
    this.name = '';

    /** Limit the number of selection tools available */
    this.tools = {
        'Point': true, 
        'Polygon': true, 
        'Line': true, 
        'default': 'Polygon',
        'buffer': true
    };

    /** autoGo = true instructs the service to query whenever
     *                the geometry has changed.
     */
    this.autoGo = false;

    /** keepAlive = true will keep the service in 'query mode'
     *                   in the background, until it is explictly turned off.
     */
    this.keepAlive = false;

    /** User input fields, select allows choosing a layer */
    this.fields = [{
        type: 'select',
        name: 'layer',
        options: [
            {value: 'parcels/parcels', label: 'Parcels'},
            {value: 'pipelines/pipelines', label: 'Pipelines'},
            {value: 'parcels/points', label: 'Parcel Points'},
        ]
    }];

    /** This function is called everytime there is an identify query.
     *
     *  @param selection contains a GeoJSON feature describing the 
     *                   geography to be used for the query.
     *
     *  @param fields    is an array containing any user-input
     *                   given to the service.
     */
    this.query = function(selection, fields) {
        // get the list of visible layers
        var visible_layers = Application.getQueryableLayers();

        // This will dispatch the query.
        // Application.dispatchQuery is used to query a set of map-sources
        //  as they are defined in the mapbook.  To perform other types of queries
        //  it would be necessary to put that code here and then manually tell
        //  the application when the query has finished, at which point resultsAsHtml()
        //  would be called by the service tab.
        Application.dispatchQuery(this.name, selection, fields, visible_layers);
    }


    /** resultsAsHtml is the function used to populate the Service Tab
     *                after the service has finished querying.
     */
    this.resultsAsHtml = function(queryId, query) {
        // initialize empty html content.
        var html = '';
        // iterate through each layer that was queried by the service.
        for(var i = 0, ii = query.layers.length; i < ii; i++) {
            // short-handing the item in the loop.
            var path = query.layers[i];

            // check to see that the layer has results and features were returned.
            if(query.results[path] && !query.results[path].failed) {
                // renderFeaturesWithTemplate will take the query, the layer specified by path,
                //  and the specified template and render it. This example uses an inline
                //  template from the mapbook. 
                // The layer in the mapbook should have a <template name='identify'>
                //  child which will be rendered here..
                html += Application.renderFeaturesWithTemplate(query, path, this.template);
            }
        }

        // return the html for rendering.
        return html;
    }
}
