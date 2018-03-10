/*

Script:         pageColumns
Version:        1.8, jQuery plugin version
Needs:          jQuery >= 1.9
                Browser that supports css columns (use modernizr to check for that: https://modernizr.com/)
Authors:        Jan Martin Roelofs (www.roelofs-coaching.nl)
Desc:           Divides columns into pages for better readability
                Can also be used with only one column
Licence:        This work is licensed under the Creative Commons Attribution 4.0 International License.
                To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/
                or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.

*/

(function($){
    'use strict';

    $.fn.pageColumns = function(options){

        var settings = $.extend( {}, $.fn.pageColumns.defaults, options );

        // sanity check
        if (($(window).width() >= settings.minWindowWidth) && ($(window).height() >= settings.minWindowHeight)){
            return this.map(function(){

                var oldColumnCssText = this.style.cssText,
                    // jQuery >= 1.8 will take care of the prefixes
                    // jQuery >= 1.9 is needed for array style properties
                    oldCssValues     = $(this).css(['column-gap', 'column-count']),
                    columnGap        = parseFloat(oldCssValues['column-gap']) ||
                                         Math.round(this.offsetWidth * settings.defColumnGap),
                    numberOfColumns  = parseInt(oldCssValues['column-count']) ||
                                         settings.defNumberOfColumns,
                    columnWidth      = Math.floor((this.offsetWidth - (columnGap * (numberOfColumns - 1)) - 1) / numberOfColumns),
                    returnArray      = [this];

                $(this).css({
                    'column-count': 'auto',
                    'column-fill' : 'auto',
                    'column-width': columnWidth,
                    'column-gap'  : columnGap,
                    'height'      : settings.columnHeight
                });

                // skip the first elements
                for (var rightBoundary = this.getBoundingClientRect().right, i = numberOfColumns; i < this.children.length; i++) {
                    // if column is too far to the right, create a new container
                    if (this.children[i].getBoundingClientRect().left > rightBoundary) {
                        var page  = this.cloneNode(false),
                            range = document.createRange();
                        range.setStartBefore(this.firstElementChild);
                        range.setEndBefore(this.children[i]);
                        page.style.cssText = oldColumnCssText;
                        // move content
                        page.appendChild(range.extractContents());
                        // put the new container before the original and continue
                        returnArray.unshift(this.parentNode.insertBefore(page, this));
                        i = numberOfColumns - 1;
                    }
                }

                this.style.cssText = oldColumnCssText;
                return returnArray;
            });
        }
    };

    $.fn.pageColumns.defaults = {
        // overridable default number of columns (if not set beforehand through css)
        defNumberOfColumns: 1,
        // overridable default required window width (do nothing in smaller windows)
        minWindowWidth:     604,
        // overridable default column height
        minWindowHeight:    450,
        // overridable default column height
        columnHeight:       '82vh',
        // overridable default column gap (if not set beforehand through css)
        defColumnGap:       0.038
    };

})(jQuery);
