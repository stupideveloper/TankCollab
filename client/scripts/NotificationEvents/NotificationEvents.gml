// Show a notification
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
