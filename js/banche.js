
var Banche = (function(){


    var trainDatas = [
        {
            lineNameZh: '延庆度假村 → 集散广场',
            lineName: 'Club Ned Joyvie → Collection square',
            departure: {
                name: 'Club Ned Joyvie',
                nameZh: '延庆度假村',
                time: ['0500', '0530', '0600', '0630', '0700']
            },
            terminal: {
                name: 'Collection square',
                nameZh: '集散广场',
                time: ['0600', '0630', '0700', '0730', '0800']
            },
        },
        {
            lineNameZh: '集散广场 → 延庆度假村',
            lineName: 'Collection square → Club Ned Joyvie',
            departure: {
                name: 'Collection square',
                nameZh: '集散广场',
                time: ['1200', '1230', '1300', '1330', '1400']
            },
            terminal: {
                name: 'Club Ned Joyvie',
                nameZh: '延庆度假村',
                time: ['1300', '1330', '1400', '1430', '1500']
            },
        },
    ]

    var fireData = function () {
        var container = $('.table-container');
        var tables = '';
        trainDatas.map(function (data) {
            var table =  drawTable(data);
            tables += table;
        });
        container.html(tables);
    };


    var drawTable = function (data) {
        var panel ='';
        var title = '<div class="description">'+
                '<p>'+ data.lineNameZh+'</p>'+
                '<p>'+ data.lineName+'</p>'+
            '</div>';
        var tbody = getTbodyContnet(data);

        var table = '<table class="banchetable table">' +
            '<thead>' +
            '<tr>' +
            '<th>班次<br/> (Train) </th>' +
            '<th>'+data.departure.nameZh+'<br/> ('+data.departure.name+')</th>' +
            '<th>'+data.terminal.nameZh+'<br/> ('+data.terminal.name+')</th>' +
            '</tr>' + tbody+
            '</thead>' +
            ' </table>';

        panel = title+table;
        return panel
    }


    var getTbodyContnet = function (data) {
        var len = data.departure.time.length;
        var tbody = '<tbody>';
        for(var i=0; i<len; i++){
            var num = i+1;
            var departureTime =timeFormat(data.departure.time[i]);
            var terminalTime =timeFormat(data.terminal.time[i]);
            var tr = '<tr>' +
                    '<td>' + num+
                '</td>'+
                '<td>' +departureTime + '</td>'+
                '<td>' + terminalTime+ '</td>'+
            '</tr>'
            if(num==3){
                tr = tr.replace('<tr>','<tr class="highlight">')
            }
            tbody += tr;
        }
        tbody +='</tbody>';
        return tbody;
    };


    var timeFormat = function (time) {
        return time.substring(0,2)+':'+time.substring(2,4)
    }


    var init = function () {
        fireData();
    };


    return {
        init: init
    }
})();

// $(document).ready(function(){
//     Banche.init();
// });
