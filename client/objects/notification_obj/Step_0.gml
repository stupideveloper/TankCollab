/// @description Insert description here
// You can write your code in this editor
//visible = true//!global.started
if (!global.started) visible = true
else if (immediatelyhide){
	immediatelyhide = false
	visible = false
}

x = window_get_width()/2
y = window_get_height()/2 - 200
if (!global.started) {
	sprite_index = instructions_spr
	//x = 50
	//y = window_get_height() - 100
}

