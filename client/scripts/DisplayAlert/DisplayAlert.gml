// Display an alert on the player's screen
function DisplayAlert(slide, duration){
	notification_obj.sprite_index = notifications_spr
	notification_obj.image_index = slide
	notification_obj.visible = true
	notification_obj.alarm[0] = 60*duration
}