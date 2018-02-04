# pageColumns Jquery plugin

### Requirements
- jQuery 1.9 or higher
- Browser that supports css columns (use modernizr to check for that: https://modernizr.com/)

### Description
Divides columns into pages for better readability
Can also be used with only one column

### Usage
#### Example
    $(function(){
    if (Modernizr.csscolumns)
        $('.npcolumns').pageColumns({defNumberOfColumns: 2, columnHeight: Math.round($(window).height() * 0.82)});
    });
