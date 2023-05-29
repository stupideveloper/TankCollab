var font = draw_get_font()
draw_set_font(IP_fnt)
draw_set_halign(fa_center)
draw_set_valign(fa_middle)
draw_text(
	camera_get_view_width(view_camera[0])/2,
	camera_get_view_height(view_camera[0])/2 - 40,
	"Choose a name:"
)
draw_text(
	camera_get_view_width(view_camera[0])/2,
	camera_get_view_height(view_camera[0])/2,
	""+string(global.name)
)
if (string_length(global.name) >= 3 && string_length(global.name) <= 16 ) {
	has_success = true;
}
if (has_success) draw_text(
	camera_get_view_width(view_camera[0])/2,
	camera_get_view_height(view_camera[0])/2 + 40,
	(string_length(global.name)>=3&& string_length(global.name)<=16)?"Click Enter to proceed!":"Invalid Name"
)
draw_set_font(font)