/**
 * Created by karina on 01/05/17.
 */

(function () {
    "use strict";

    angular
        .module('meanMapApp')
        .directive('toolbar', toolbar);
    function toolbar(){
        return{
            templateUrl: 'components/toolbar/toolbar.tpl.html',
            controller: toolbarController,
            controllerAs: 'toolbar'
        }
    }
    function toolbarController() {
        
    }
});

