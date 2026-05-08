package router

import (
	"github.com/gin-gonic/gin"
	"github.com/lejianwen/rustdesk-api/v2/global"
	"github.com/lejianwen/rustdesk-api/v2/http/controller/web"
	"net/http"
)

func WebInit(g *gin.Engine) {
	i := &web.Index{}
	g.GET("/", i.Index)

	if global.Config.App.WebClient == 1 {
		g.GET("/webclient-config/index.js", i.ConfigJs)
	}

	if global.Config.App.WebClient == 1 {
		g.StaticFS("/webclient", http.Dir(global.Config.Gin.ResourcesPath+"/web"))
		g.StaticFS("/webclient2", http.Dir(global.Config.Gin.ResourcesPath+"/web2"))
		webclient3Index := global.Config.Gin.ResourcesPath + "/web3/index.html"
		webclient3Files := http.StripPrefix("/webclient3", http.FileServer(http.Dir(global.Config.Gin.ResourcesPath+"/web")))
		g.GET("/webclient3", func(c *gin.Context) {
			c.File(webclient3Index)
		})
		g.GET("/webclient3/*filepath", func(c *gin.Context) {
			switch c.Param("filepath") {
			case "", "/", "/index.html":
				c.File(webclient3Index)
			default:
				webclient3Files.ServeHTTP(c.Writer, c.Request)
			}
		})
	}
	g.StaticFS("/_admin", http.Dir(global.Config.Gin.ResourcesPath+"/admin"))
}
