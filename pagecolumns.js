/*

  Script:   pageColumns
  Version:  1.2, jQuery plugin version
  Needs:    jQuery >= 1.9
            Browser that supports css columns (use modernizr to check for that: https://modernizr.com/)
  Authors:  Jan Martin Roelofs (www.roelofs-coaching.nl)
  Desc:     Divides columns into pages for better readability
            Can also be used with only one column
  Licence:  This work is licensed under the Creative Commons Attribution 4.0 International License.
            To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/
            or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.

*/

(function($){

  $.fn.pageColumns = function(options){
    'use strict';

    var settings = $.extend({
                     // overridable default number of columns (if not set beforehand through css)
                     defNumberOfColumns: 2,
                     // overridable default required window width (do nothing in smaller windows)
                     minWindowWidth:     604,
                     // overridable default column height
                     columnHeight:       Math.round($(window).height() * 0.82),
                     // overridable default column gap (if not set beforehand through css)
                     defColumnGap:       0.038
                   }, options),
        result   = $();

    // sanity check
    if ($(window).width() >= settings.minWindowWidth){
      this.each(function(){
        // merging one by one ensures the right order of the returned object
        $.merge(result, $(this));

        var oldColumnCssText= this.style.cssText,
            // jQuery >= 1.8 will take care of the prefixes
            // jQuery >= 1.9 is needed for array style properties
            oldCssValues    = $(this).css(['column-gap', 'column-count']),
            columnGap       = parseFloat(oldCssValues['column-gap']) ||
                                Math.round(this.offsetWidth * settings.defColumnGap),
            numberOfColumns = parseInt(oldCssValues['column-count']) ||
                                settings.defNumberOfColumns,
            columnWidth     = Math.floor((this.offsetWidth - (columnGap * (numberOfColumns - 1)) - 1) / numberOfColumns);

        $(this).css({
          'column-count': 'auto',
          'column-fill' : 'auto',
          'column-width': columnWidth,
          'column-gap'  : columnGap,
          'height'      : settings.columnHeight
        });

        // skip the first elements
        for (var i= numberOfColumns; this.children[i]; i++) {

          // if column is too far to the right, create a new container
          if (this.children[i].getBoundingClientRect().left > this.getBoundingClientRect().right) {
            var newColumn= this.cloneNode(false);
            newColumn.style.cssText= oldColumnCssText;
            // move content
            for (var j= this.children.length; j > i; j--)
              newColumn.appendChild(this.children[i]);
            // put the new container after the old and give it the same treatment
            $.merge(result, $(newColumn).insertAfter(this).pageColumns());
          }

        }

        // restore old styles
        this.style.cssText= oldColumnCssText;
      });
    }
    return result;
  };

})(jQuery);
