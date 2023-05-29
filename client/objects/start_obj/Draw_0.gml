var font = draw_get_font()
draw_set_font(IP_fnt)
draw_set_halign(fa_center)
draw_set_valign(fa_middle)
if (struct_exists(global,"failed")) {
	if (struct_get(global,"failed")) {
	draw_text(
	camera_get_view_width(view_camera[0])/2,
	camera_get_view_height(view_camera[0])/2-130,
	"Connection Failed!"
)}}
draw_text(
	camera_get_view_width(view_camera[0])/2,
	camera_get_view_height(view_camera[0])/2 - 50,
	"Enter Server Code:"
)
var icon = (flasher mod 40 > 20 && string_length(global.ip_construct) != 7)?"▌":" "
draw_text(
	camera_get_view_width(view_camera[0])/2,
	camera_get_view_height(view_camera[0])/2,
	""+string(global.ip_construct) + icon
)
if (IPCheck(decodeCode(global.ip_construct)) && string_length(global.ip_construct) == 7) {
	has_success = true;
}
if (has_success) draw_text(
	camera_get_view_width(view_camera[0])/2,
	camera_get_view_height(view_camera[0])/2 + 50,
	(IPCheck(decodeCode(global.ip_construct)) && string_length(global.ip_construct) == 7)?"Valid Code! Click Enter to connect":"Invalid Code"
)
draw_set_font(font)