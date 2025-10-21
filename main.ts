// 发送端 (Sender) - 遥控器最终版

let lift_on = 0
radio.setGroup(228)
basic.showIcon(IconNames.Target)

// Logo键：切换升力风扇的开/关
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    if (lift_on == 0) {
        lift_on = 1
        radio.sendValue("lift", 1) // 发送"开启"命令
        // 【已修正】使用 showArrow 来显示北向箭头
        basic.showArrow(ArrowNames.North)
    } else {
        lift_on = 0
        radio.sendValue("lift", 0) // 发送"关闭"命令
        basic.showIcon(IconNames.Target)
    }
})

// 按键A/B/AB：控制转向
input.onButtonPressed(Button.A, function () {
    radio.sendValue("steer", 45)
    basic.showArrow(ArrowNames.West)
})
input.onButtonPressed(Button.B, function () {
    radio.sendValue("steer", 135)
    basic.showArrow(ArrowNames.East)
})
input.onButtonPressed(Button.AB, function () {
    radio.sendValue("steer", 90)
    basic.showArrow(ArrowNames.North)
})

// 晃动：紧急停止
input.onGesture(Gesture.Shake, function () {
    radio.sendValue("stop", 0)
    lift_on = 0 // 同时重置升力状态
    basic.showIcon(IconNames.Skull)
})

// 永久循环：检测倾斜来控制推进速度
basic.forever(function () {
    let pitch = input.acceleration(Dimension.Y)
    if (pitch < -150) {
        let thrust_speed = pins.map(
            pitch,
            -200,
            -1023,
            200,
            1023
        )
        radio.sendValue("thrust", thrust_speed)
    } else {
        radio.sendValue("thrust", 0)
    }
    basic.pause(50)
})