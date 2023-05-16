/// @description Insert description here
// You can write your code in this editor
var font = draw_get_font()
draw_set_font(IP_fnt)
draw_set_halign(fa_center)
draw_set_valign(fa_center)
if (global.failed) {
	draw_text(
	camera_get_view_width(view_camera[0])/2,
	camera_get_view_height(view_camera[0])/2-120,
	"Connection Failed!"
)}
draw_text(
	camera_get_view_width(view_camera[0])/2,
	camera_get_view_height(view_camera[0])/2 - 40,
	"Enter Server IP:"
)
draw_text(
	camera_get_view_width(view_camera[0])/2,
	camera_get_view_height(view_camera[0])/2,
	global.ip_construct
)
if (IPCheck(global.ip_construct)) {
	has_success = true;
}
if (has_success) draw_text(
	camera_get_view_width(view_camera[0])/2,
	camera_get_view_height(view_camera[0])/2 + 40,
	IPCheck(global.ip_construct)?"Valid IP! Click Enter to connect":"Invalid IP"
)
draw_set_font(font)
