package org.ailog.ailog.interfaces

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@Controller
class TestController {

    @GetMapping("/index")
    fun test() : String {
        return "index"
    }

    @GetMapping("/callback")
    fun callback() : String {
        return "callback"
    }

    @GetMapping("/main")
    fun main() : String {
        return "main"
    }

    @GetMapping("/chatting")
    fun chat() : String {
        return "chat"
    }

}
