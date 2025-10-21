// 发送端 (Sender) - 遥控器最终版 (增加后退功能)

let lift_on = 0
radio.setGroup(228)
basic.showIcon(IconNames.Target)

// Logo键：切换升力风扇的开/关
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    if (lift_on == 0) {
        lift_on = 1
        radio.sendValue("lift", 1) // 发送"开启"命令
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

// 永久循环：检测倾斜来控制前进和后退
basic.forever(function () {
    // 读取前后倾斜值 (Y轴)
    let pitch = input.acceleration(Dimension.Y)

    // 【新功能】向前倾斜超过阈值
    if (pitch < -200) {
        let forward_speed = pins.map(pitch, -200, -1023, 200, 1023)
        // 发送一个名叫 "drive" 的命令，值为正数代表前进
        radio.sendValue("drive", forward_speed)
        // 【新功能】向后倾斜超过阈值
    } else if (pitch > 200) {
        let backward_speed = pins.map(pitch, 200, 1023, 200, 1023)
        // 发送一个名叫 "drive" 的命令，值为负数代表后退
        radio.sendValue("drive", -1 * backward_speed)
    } else {
        // 放平则停止
        radio.sendValue("drive", 0)
    }
    basic.pause(50)
})