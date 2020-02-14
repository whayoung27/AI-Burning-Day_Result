package main

import (
	"fmt"
	"github.com/deep-whale/ga"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/best-champions", func(c *gin.Context) {
		var p struct {
			SizePopulation int
			NumGeneration int
		}
		c.BindQuery(&p)
		fmt.Printf("%v", p)
		res := ga.Run(p.SizePopulation, p.NumGeneration)
		c.JSON(200, res)
	})

	r.GET("/health", func(c *gin.Context) {
		c.Status(200)
	})

	r.GET("/ready", func(c *gin.Context) {
		c.Status(200)
	})

	r.Run(":80")
}
