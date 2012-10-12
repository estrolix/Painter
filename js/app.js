/* Author: Estrolix */

/**
* @todo
*/

function Painter(canvas_obj)
{
	return {
		canvas: canvas_obj,
		jCanvas: null, //jQuery canvas object
		context: null,
		activeDrawing: false,
		defaultBgColor: '#ffffff',
		settings: { //default settings
			color: '#df4b26',
			brushSize: 40,
			opacity: 1,
			brushStyle: 'round',
		},
		pathsStorage: [[]],
		//historyFuture: {paths: [], settings: []},
		settingsStorage: [],
		brushPreview: $('#brushPreview')[0],
		historyUndoButton: $('#historyUndo'),
		//historyRedoButton: $('#historyRedo'),

		init: function(){
			
			var painter = this;
			this.jCanvas = $(this.canvas);
			this.context = this.canvas.getContext('2d');
			this.context.fillStyle = this.defaultBgColor;
			//this.clear();

			this.jCanvas.mousedown(function(e){
				//painter.clearHistoryFuture();
				painter.activeDrawing = true;
				painter.pathsStorage[painter.pathsStorage.length - 1].push(painter.getCursorPosition(e));
				painter.settingsStorage.push($.extend({}, painter.settings)); //pushing painter.settings by value
  				painter.redraw();
			});

			$(document, this.jCanvas).mouseup(function(){
				if(!painter.activeDrawing)
					return;
				painter.stopDrawing();
			});

			$(document, this.jCanvas).mousemove(function(e){
				if(!painter.activeDrawing)
					return;
				painter.pathsStorage[painter.pathsStorage.length - 1].push(painter.getCursorPosition(e));
    			painter.redraw();
			});

			//this.redrawBrushPreview();

			return this;
		},

		stopDrawing: function(){
			this.activeDrawing = false;
			this.pathsStorage.push([]);
		},

		getCursorPosition: function(event){
			var offset = this.jCanvas.offset();
			return {
					x: event.pageX - offset.left,
					y: event.pageY - offset.top
					};
		},

		redraw: function(){
			this.clear();
			var painter = this;
			var currentSettings = this.settings;

			$.each(this.pathsStorage, function(index, path){
				if (path[0] === undefined) {
					return;
				}

				painter.settings = painter.settingsStorage[index];
				painter.applySettings();

				painter.context.beginPath();
				painter.context.moveTo(path[0].x-1, path[0].y-1);
				var i = 0;
				do {
				    painter.context.lineTo(path[i].x, path[i].y);
			    } while(i++ < (path.length - 1));
			    painter.context.stroke();
		    	painter.context.closePath();
			});

			this.settings = currentSettings;
			this.checkHistoryButtonsActivity();
		},

		clear: function(){
			//this.canvas.width = this.canvas.width; // doesn't work in some browsers
			//this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			var oldOpacity = this.settings.opacity;
			this.setOpacity(1);
			this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.setOpacity(oldOpacity);
			//this.clearHistoryFuture();
			this.checkHistoryButtonsActivity();
		},

		/*clearHistoryFuture: function(){
			this.historyFuture = {paths: [], settings: []};
		},*/

		newPict: function(){
			this.clear();
			this.pathsStorage = [[]];
			this.settingsStorage = [];
			this.checkHistoryButtonsActivity();
		},

		setColor: function(color){
			this.settings.color = color;
			this.applySettings();
			this.redrawBrushPreview();
		},

		setBrushSize: function(val){
			this.settings.brushSize = val;
			this.applySettings();
			this.redrawBrushPreview();
		},

		setOpacity: function(val){
			this.settings.opacity = val;
			this.applySettings();
			this.redrawBrushPreview();
		},

		applySettings: function(){
			//console.log(this.settings);
			this.context.strokeStyle = this.settings.color;
			this.context.lineWidth   = this.settings.brushSize;
			this.context.globalAlpha = this.settings.opacity;
			this.context.lineCap     = this.settings.brushStyle;
			this.context.lineJoin    = this.settings.brushStyle;
		},

		redrawBrushPreview: function(){
			this.brushPreview.width = this.brushPreview.width; //clear canvas
			var context = this.brushPreview.getContext('2d');
			context.beginPath();
	        context.arc(this.brushPreview.width/2, this.brushPreview.height/2, this.settings.brushSize/2, 0, 2 * Math.PI, false);
	        context.fillStyle = this.settings.color;
	        context.globalAlpha = this.settings.opacity;
	        context.fill();
	        context.closePath();
		},

		historyUndo: function(){
			if(this.pathsStorage[0][0] === undefined)
				return;

			this.pathsStorage.pop(); // pop an empty array
			this.pathsStorage.pop(); // pop last line
			this.pathsStorage.push([]); // push empty array back
			this.settingsStorage.pop();
			
			//this.historyFuture.paths.push(this.pathsStorage.pop());
			//this.historyFuture.settings.push(this.settingsStorage.pop());
			this.redraw();
			this.checkHistoryButtonsActivity();
		},

		historyRedo: function(){
			if(!this.historyFuture.paths.length)
				return;
			var emptyPath = this.pathsStorage.pop();
			this.pathsStorage.push(this.historyFuture.paths.pop());
			this.pathsStorage.push(emptyPath);
			this.settingsStorage.push(this.historyFuture.settings.pop());
			this.redraw();
			this.checkHistoryButtonsActivity();
		},

		save: function(){
			Canvas2Image.saveAsPNG(this.canvas);
		},

		checkHistoryButtonsActivity: function(){
			if(this.pathsStorage[0][0] === undefined)
				this.historyUndoButton.addClass('disabled');
			else
				this.historyUndoButton.removeClass('disabled');

			/*if(!this.historyFuture.paths.length)
				this.historyRedoButton.addClass('disabled');
			else
				this.historyRedoButton.removeClass('disabled');*/
		}

	}

}