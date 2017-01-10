require.config({
    baseUrl: '../../',
    paths: {
      jquery: 'libraries/jquery',
      underscore: 'libraries/underscore',
      backbone: 'libraries/backbone',
	  CanvasJS : 'libraries/jquery.canvasjs.min',
	  moment : 'libraries/moment',
	  timepicker : 'libraries/jquery.timepicker',
	  datepicker : 'libraries/bootstrap-datepicker',
	  datepair : 'libraries/datepair.min',
	  colorpicker : 'libraries/bootstrap-colorpicker',
    },
    shim: {
      jquery: [

      ],
      backbone: {
          deps: [
            'underscore',
            'jquery'
          ],
          exports: 'Backbone'
      },
	  backboneForms: {
        deps: ['backbone']
      },
      underscore: {
          exports: '_'
      },
	  CanvasJS: {
          deps: [
            'jquery'
          ],
          exports: 'CanvasJS'
      },
	  moment: {
          deps: [
            'jquery'
          ],
          exports: 'moment'
      },
	  timepicker: {
          deps: [
            'jquery'
          ],
          exports: 'timepicker'
      },
	  datepicker: {
          deps: [
            'jquery'
          ],
      },
	  datepair: {
          deps: [
            'jquery'
          ],
          exports: 'Datepair'
      },
	  colorpicker: {
          deps: [
            'jquery'
          ],
      }
    }
});
