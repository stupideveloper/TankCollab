var font = draw_get_font()
draw_set_font(IP_fnt)
draw_set_color(c_black)
draw_set_halign(fa_center)
draw_set_valign(fa_middle)

draw_self()
var icon = string_length(global.name)>=16?"":((flasher mod 40 > 20 && string_length(global.name) != 16)?"▌":"  ")
draw_text(
	x,y+45,
	""+string(global.name)+icon
)
if (string_length(global.name) >= 3 && string_length(global.name) <= 16 ) {
	has_success = true;
}
if (has_success) draw_text(
	x,
	y + 200,
	(string_length(global.name)>=3&& string_length(global.name)<=16)?"Click Enter to proceed!":"Name too short!"
)
draw_set_font(font)