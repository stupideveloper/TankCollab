/// @description Insert description here
// You can write your code in this editor
if (clicked) {
	slide += sprite_get_number(sprite_index)/60 
	image_index = slide
}
if (floor(slide) == sprite_get_number(sprite_index)) {
	room_goto(NameSelectRoom)
}
draw_sprite(intro_spr,0,0,0)
draw_self()