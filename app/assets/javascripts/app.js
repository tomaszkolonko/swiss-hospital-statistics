define([
    'views/abstract/AbstractSwissMap',
    'views/PieChart',
    'views/SeriesChart',
    'views/CardBoardView',
    'views/CardView',
    'views/abstract/AbstractSeriesChart',
    'models/categories/SexCategory',
    'helpers/CategoryAdapter',
    'helpers/CodeAdapter'
], function(AbstractSwissMap,PieChart,SerieChart, CardBoardView, CardView, AbstractSeriesChart){

    "use strict";
    function App() {
        var _this = this;

        //$('body').append(new $('<div></div>').css('width', '600px').append(new AbstractSeriesChart(700,500)));

        _this.cardView = function () {
            $('body').append(
                new CardBoardView()
                    .add(new CardView().add(new AbstractSwissMap().class('align-vertical')))
                    .add(new CardView().add(new PieChart().class('align-vertical').display(function(entity) {
                        return [
                            {type: 'cesarean', amount: entity},
                            {type: 'notcesarean', amount: 100 - entity},
                        ];
                    })
                        .key('type')
                        .value('amount')
                        .transformed(function(v){return v.toPrecision(3)})
                        .labeled(function (value) {return value+'%'})
                        .openOn(35.49)))
                    .add(new CardView().add(new SerieChart().class('align-vertical')
                            .display(function(series){
                                return _.map(series, function(serie){
                                    serie.data = _.map(_.range(-Math.PI, Math.PI, 0.01), function(x){
                                        return {x : x, y : serie.f(x)} });
                                    return serie })})

                            .transformed(function(y) { return Math.abs(y)})
                            .value('y')
                            .key('x')
                            .yAxis('f(x)')
                            .labeled(function(serie){return 'f(x)=|'+serie.serie+'|';})
                            .keyTransformed(function(x) {return x/Math.PI})
                            .keyLabeled(function(x) {return x+(x == 0 ? '':'PI')})
                            .openOn( [
                                {serie: 'sin(x)', f: function(x){return Math.sin(x)}},
                                {serie: 'cos(x)', f: function(x){return Math.cos(x)}},
                                {serie: 'cos(x^2)', f: function(x){return Math.cos(x*x)}}])
                    ))
                    .add(new CardView().add(new PieChart(300,200).class('align-vertical').display(function(entity) {
                        return [
                            {type: 'cesarean', amount: entity},
                            {type: 'notcesarean', amount: 100 - 50 - entity},
                            {type: 'bla', amount: 50}
                        ];
                    })
                        .key('type')
                        .value('amount')
                        .transformed(function(v){return v.toPrecision(3)})
                        .openOn(35.49)))
                    //.add(new CardView().add(new AbstractSwissMap().class('align-vertical')))
                    .add(new CardView().add(new PieChart().class('align-vertical')
                        .display(function(entity) {return _.map(entity, function(str){return{text: str, length: str.length}})})
                        .transformed(function(value){return value*2})
                        .labeled(function(value,element){return element.text+' - '+value})
                        .key('text')
                        .value('length')
                        .openOn([ 'a','bb','ccc' ]))));
        };
        _this.visualisations = function () {
            $("body").append(new SwissMap());
            var form = $('<input>');
            $("body").append(form);

            var pie = new PieChart();
            $('body').append(pie);

            pie
                .display(function(entity) {
                    return [
                        {type: 'cesarean', amount: entity},
                        {type: 'notcesarean', amount: 100 - 50 - entity},
                        {type: 'bla', amount: 50}
                    ];
                })
                .key('type')
                .value('amount')
                .openOn(35.49);

            form.keyup(function(e){
                var value = $(this).val();
                value = Math.min(value.length === 0 ? 0 : parseFloat(value), 100);
                pie.openOn(value);
            });
        };
        _this.codes = function () {
            console.log('------------ C H O P ---------------');
            console.log('Received from server:');
            var chop = '{"codes":{"chop":{"description":"Chop code is type of code that bla bla bla","codes":[{"code":"001200","description":"Inhalation von Stickstoffmonoxyd, Dauer der Behandlung bis unter 48 Stunden","years":[{"categories":[{"interval":[{"categories":[{"percentile":[{"amount":14,"percentile":5.0},{"amount":14.0,"percentile":10.0},{"amount":14.0,"percentile":25.0},{"amount":14.0,"percentile":50.0},{"amount":14.0,"percentile":75.0},{"amount":14.0,"percentile":90.0},{"amount":14.0,"percentile":95.0}]}],"n":1,"dad":14.0,"interval":{"from":0,"to":14},"max":14,"min":14,"sa":0.0}]}],"year":2013}]}]}}}';
            console.log(chop);
            var chopCodes = ServiceProvider.jsonParser.parse(chop);
            console.log('Serialized in Code Models:');
            _.each(chopCodes, function(each) {
                console.log(each.toString())});

            console.log('------------ D R G ---------------');
            console.log('Received from server:');
            var drg = '{"codes":{"drg":{"codes":[{"code":"901A","description":"Ausgedehnte OR-Prozedur ohne Bezug zur Hauptdiagnose mit komplizierenden Prozeduren oder Strahlentherapie","years":[{"categories":[{"interval":[{"categories":[{"percentile":[{"amount":5,"percentile":5},{"amount":5.4,"percentile":10},{"amount":12,"percentile":25},{"amount":24,"percentile":50},{"amount":"35.5.0","percentile":75},{"amount":"44.8.0","percentile":90},{"amount":48.6,"percentile":95}]}],"dad":26,"interval":{"from":70},"max":85,"min":1,"n":23,"sa":19}]}],"year":"2013"}]}],"description":"Drg code is type of code that bla bla bla"}}}';
            console.log(drg);
            console.log('Serialized in Code Models:');
            var drgCodes = ServiceProvider.jsonParser.parse(drg);
            _.each(drgCodes, function(each) {
                console.log(each.toString())});

            console.log('------------ I C D ---------------');
            console.log('Received from server:');
            var icd = '{"codes":{"icd":{"code":"A010","description":"Typhus abdominalis","years":[{"categories":[{"interval":[{"categories":[{"percentile":[{"amount":2,"percentile":5},{"amount":2,"percentile":10},{"amount":6,"percentile":25},{"amount":6.5,"percentile":50},{"amount":7,"percentile":75},{"amount":9,"percentile":90},{"amount":9,"percentile":95}]}],"n":6,"dad":6.2,"interval":{"from":0,"to":14},"max":9,"min":2,"sa":2.32}]}],"year":"2013"}]}}}';
            console.log(icd);
            console.log('Serialized in Code Models:');
            var icdCodes = ServiceProvider.jsonParser.parse(icd);
            _.each(icdCodes, function(each){
                console.log(each.toString())});

            console.log('------------ A G E ---------------');
            console.log('Received from server:');
            var age = '{"codes":{"age":{"code":"010","description":"Brucellose","years":[{"categories":[{"sex":[{"categories":[{"valueInterval":[{"interval":{"from":20,"to":24},"n":1},{"interval":{"from":30,"to":34},"n":1},{"interval":{"from":35,"to":39},"n":1}]}],"sex":"f"},{"categories":[{"valueInterval":[{"interval":{"from":25,"to":29},"n":2},{"interval":{"from":80,"to":84},"n":1}]}],"sex":"m"}]}],"year":"2013"}]}}}';
            console.log(age);
            console.log('Serialized in Code Models:');
            var ageCodes = ServiceProvider.jsonParser.parse(age);
            _.each(ageCodes, function(each){
                console.log(each.toString())});

            console.log('------- K E   R E G I O N ---------');
            console.log('Received from server:');
            var kdeRegion = '{"codes":{"ke":{"code":"ZH01","description":"Anzahl Kaiserschnitte an Entbindungen","years":[{"categories":[{"ke_b":[{"categories":[{"ke_region":[{"code":"ZH01","name":"Zürich-City","births":186,"cesareans":70,"cesareansPercent":37.6,"age":33.3,"cesareanAge":35.1}]}]}]}],"year":2013}]}}}';
            console.log(kdeRegion);
            console.log('Serialized in Code Models:');
            var keRegionCodes = ServiceProvider.jsonParser.parse(kdeRegion);
            _.each(keRegionCodes, function(each){
                console.log(each.toString())});


            console.log('------- K E   K A N T O N ---------');
            console.log('Received from server:');
            var keKanton = '{"codes":{"ke":{"code":"ZH","description":"Anzahl Kaiserschnitte an Entbindungen","years":[{"categories":[{"ke_a":[{"categories":[{"ke_kanton":[{"code":"ZH","cesareansPercent":35.49,"age":33.3,"cesareanAge":33.0}]}]}]}],"year":2013}]}}}';
            console.log(keKanton);
            console.log('Serialized in Code Models:');
            var keKantonCodes = ServiceProvider.jsonParser.parse(keKanton);
            _.each(keKantonCodes, function(each){
                console.log(each.toString())});
        };

        //_this.cardView();
        _this.codes();
    }

    return App
});
