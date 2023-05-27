// Script assets have changed for v2.3.0 see
// https://help.yoyogames.com/hc/en-us/articles/360005277377 for more information
function EnemyShieldDestroyed(){
	if (global.left_shield_other_health <= 0 && global.right_shield_other_health <= 0) {
		DisplayAlert(1, 5)
	} else {
		DisplayAlert(0, 5)
	}
}


function OwnShieldDestroyed(){
	if (global.left_shield_own_health <= 0 && global.right_shield_own_health <= 0) {
		DisplayAlert(3, 5)
	} else {
		DisplayAlert(2, 5)
	}
}
