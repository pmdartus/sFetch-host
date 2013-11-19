'use strict';

/* Filters */

angular.module('SalesFetchApp.filters', []).
    filter('niceDate', function() {
        return function (date) {
            
            //Month in string
            var month;
            switch(date.getMonth()+1){
            case 1: month = 'January';
                break;
            case 2: month = 'February';
                break;
            case 3: month = 'March';
                break;
            case 4: month = 'April';
                break;
            case 5: month = 'May';
                break;
            case 6: month = 'June';
                break;
            case 7: month = 'July';
                break;
            case 8: month = 'August';
                break;
            case 9: month = 'September';
                break;
            case 10: month = 'October';
                break;
            case 11: month = 'November';
                break;
            case 12: month = 'December';
                break;
            }
            return month + ', ' + date.getDate();
        };
    }).
    filter('srcImg', function() {
        return function (url, infoNeeded) {
            
            //Regex provider
            var regex = /https?\:\/\/\D{0,4}\.?(.*)\.\D{1,4}\/.*\.(\D*)$/;
            var infos = regex.exec(url);
            console.info(infoNeeded);

            switch(infoNeeded) {
            case "provider":
                if (infos) {
                    return infos[1].toLowerCase();
                } else {
                    return "salesforce";
                }
                break;
            case "type":
                if (infos) {
                    switch(infos[2].toLowerCase()) {
                        case "pptx":
                            return "ppt";
                        case "docx":
                            return "doc";
                        case "xlsx":
                            return "xls";
                        case "png":
                        case "jpg":
                        case "jpeg":
                        case "gif":
                            return "img";
                        default:
                            return infos[2].toLowerCase();
                    }
                } else {
                    return "doc";
                }
                break;
            default:
                console.log("error: srcImg called with wrong infoNeeded param");
                return "error";
                break;
            }
        };
    });
