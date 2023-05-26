var font = draw_get_font()
draw_set_font(IP_fnt)
draw_set_halign(fa_center)
draw_set_valign(fa_middle)
if (struct_exists(global,"failed")) {
	if (struct_get(global,"failed")) {
	draw_text(
	camera_get_view_width(view_camera[0])/2,
	camera_get_view_height(view_camera[0])/2-120,
	"Connection Failed!"
)}}
draw_text(
	camera_get_view_width(view_camera[0])/2,
	camera_get_view_height(view_camera[0])/2 - 40,
	"Enter Server Code:"
)
draw_text(
	camera_get_view_width(view_camera[0])/2,
	camera_get_view_height(view_camera[0])/2,
	""+string(global.ip_construct)
)
if (IPCheck(decodeCode(global.ip_construct)) && string_length(global.ip_construct) == 7) {
	has_success = true;
}
if (has_success) draw_text(
	camera_get_view_width(view_camera[0])/2,
	camera_get_view_height(view_camera[0])/2 + 40,
	(IPCheck(decodeCode(global.ip_construct)) && string_length(global.ip_construct) == 7)?"Valid Code! Click Enter to connect":"Invalid Code"
)
draw_set_font(font)