var font = draw_get_font()
draw_set_font(IP_fnt)
draw_set_halign(fa_center)
draw_set_valign(fa_middle)
draw_text(
	camera_get_view_width(view_camera[0])/2,
	camera_get_view_height(view_camera[0])/2 - 50,
	"Choose a name:"
)
var icon = (flasher mod 40 > 20 && string_length(global.name) != 16)?"▌":" "
draw_text(
	camera_get_view_width(view_camera[0])/2,
	camera_get_view_height(view_camera[0])/2,
	""+string(global.name)+icon
)
if (string_length(global.name) >= 3 && string_length(global.name) <= 16 ) {
	has_success = true;
}
if (has_success) draw_text(
	camera_get_view_width(view_camera[0])/2,
	camera_get_view_height(view_camera[0])/2 + 50,
	(string_length(global.name)>=3&& string_length(global.name)<=16)?"Click Enter to proceed!":"Name too short!"
)
draw_set_font(font)