/* Author: Estrolix */

$(function(){
	
	showLoadingAnimation();
	
	var App = Painter($('#painting')[0]).init();

	$('#colorpicker').miniColors({
		letterCase: 'uppercase',
		change: function(hex, rgb) {
			App.setColor(hex);
		}
	});

	$('#colorpicker').miniColors('value', '#df4b26');

	$('#brushSizeSlider').slider({
		min: 1,
		max: 65,
		value: 40,
		slide: function(event, ui) {
			App.setBrushSize(ui.value);
		}
	});

	$('#brushOpacitySlider').slider({
		min: 1,
		max: 100,
		value: 100,
		slide: function(event, ui) {
			App.setOpacity(ui.value/100);
		}
	});

	$('.clearCanvasButton').click(function(){
		$('#dialog-confirmClearing').dialog('open');
		return false;
	});

	$('#historyUndo').click(function(){
		App.historyUndo();
	});

	/*$('#historyRedo').click(function(){
		App.historyRedo();
	});*/

	$(document).keydown(function(e){
		if (e.keyCode == 90 && e.ctrlKey) {
			App.historyUndo(); //undo on Ctrl+Z
		} else if (e.keyCode == 89 && e.ctrlKey) {
			App.historyRedo(); //redo on Ctrl+Y
		}
	});

	$('.save').click(function(){
		App.save();
	});

	$.fx.speeds._default = 300;
	$('#dialog-confirmClearing').dialog({
			resizable: false,
			autoOpen: false,
			show: 'fade',
			hide: 'fade', ///explode
			modal: true,
			buttons: {
				'Yes': function() {
					App.newPict();
					$(this).dialog('close');
				},
				'No': function() {
					$(this).dialog('close');
				}
			}
		});

});

function showLoadingAnimation()
{
	$('#logo').fadeIn(500, function(){
		$('#board').fadeIn(500);
		$('#toolbox').slideDown(500);
	});
	$('footer').slideDown();
}