// Script assets have changed for v2.3.0 see
// https://help.yoyogames.com/hc/en-us/articles/360005277377 for more information
function DisplayAlert(slide, duration){
	notification_obj.sprite_index = notifications_spr
	notification_obj.image_index = slide
	notification_obj.visible = true
	notification_obj.alarm[0] = 60*duration
}