/// @description Insert description here
// You can write your code in this editor

draw_set_color(c_black)
draw_set_font(Inventory_fnt)
draw_sprite(inventory_spr,0,x,y)
try {
	draw_text(x+60,y+text_y_offset,global.gems.PURPLE)
	draw_text(x+165,y+text_y_offset,global.gems.RED)
	draw_text(x+270,y+text_y_offset,global.gems.GREEN)
	draw_text(x+370,y+text_y_offset,global.gems.BLUE)
} catch (e) {

}
