package main

import (
	"encoding/json"
	"fmt"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"net/http"
	"os"
)

type GAResponse struct {
	BestFitness float64
	WorstFitness float64
	Genes [][]int
}

func main() {
	r := gin.Default()

	r.GET("/best-champions", func(c *gin.Context) {
		var p struct {
			SizePopulation int `json:"sizePopulation"`
			NumGeneration int `json:"numGeneration"`
		}
		c.BindQuery(&p)

		res, err := http.Get(os.Getenv("GA_HOST") + "/best-champions" + fmt.Sprintf("?SizePopulation=%v&NumGeneration=%v", p.SizePopulation, p.NumGeneration))
		//res, err := http.Get("http://localhost:81/best-champions" + fmt.Sprintf("?SizePopulation=%v&NumGeneration=%v", p.SizePopulation, p.NumGeneration))
		if err != nil {
			c.JSON(400, &gin.H{
				"msg": err.Error(),
			})
			return
		}
		defer res.Body.Close()
		b, _ := ioutil.ReadAll(res.Body)
		var j GAResponse
		json.Unmarshal(b, &j)
		c.JSON(200, &gin.H{
			"bestFitness": j.BestFitness,
			"worstFitness": j.WorstFitness,
			"genes": j.Genes,
		})
	})

	r.Use(static.Serve("/", static.LocalFile("./react", true)))

	port, ok := os.LookupEnv("PORT")
	if !ok {
		port = "80"
	}

	r.Run(fmt.Sprintf(":%s", port))

	//mat := gocv.IMRead("./sample-tab-images/tab-1024-768-1.png", 1)
	//shoes := gocv.IMRead("./resized-item-images/2003.png", 1)
	//mat2Col := mat.Cols() - shoes.Cols() +1
	//mat2Row := mat.Rows() - shoes.Rows() +1
	//mat2 := gocv.NewMatWithSize(mat2Row, mat2Col, 1)
	//gocv.MatchTemplate(mat, shoes, &mat2, 1, gocv.NewMat())
	//gocv.Normalize(mat2, &mat2, 0, 1, 32)
	//
	//mival, maval, miloc, maloc := gocv.MinMaxLoc(mat2)
	//log.Printf("mival : %v\nmaval : %v\nmiloc : %v\nmaloc : %v\n",
	//	mival, maval, miloc, maloc)
	//
	//red := color.RGBA{R: 255}
	//blue := color.RGBA{B: 255}
	//gocv.Circle(&mat, miloc, 20, red, 8)
	//gocv.Circle(&mat, maloc, 20, blue, 8)

	//window := gocv.NewWindow("mat")
	//defer window.Close()
	//tabwindow := gocv.NewWindow("tab")
	//defer tabwindow.Close()
	//
	////origin := gocv.IMRead("./sample-tab-images/tab-3360-2100-1.png", 1)
	//origin := gocv.IMRead("./sample-tab-images/tab-1024-768-1.png", 1)
	//cols := origin.Cols() / (origin.Cols()/ 1024)
	//rows := origin.Rows() / (origin.Cols() / cols)
	//tab := gocv.NewMatWithSize(rows, cols, 1)
	//gocv.Resize(origin, &tab, image.Point{X:cols, Y:rows}, 0, 0, 0)
	//mat := gocv.NewMatWithSize(tab.Cols(), tab.Rows(), 1)
	//tab.CopyTo(&mat)
	//
	//var wg sync.WaitGroup
	//start := time.Now()
	//
	//ch := make(chan int)
	//for i := 0; i<30; i++{
	//	go func() {
	//		for no := range ch {
	//			wg.Add(1)
	//			web.MarkItemByNo(tab, &mat, no)
	//			wg.Done()
	//		}
	//	}()
	//}
	//for no := 1000; no < 5000; no++ {
	//	if !web.IsExistItemByNo(no) {
	//		continue
	//	}
	//	ch <- no
	//}
	//close(ch)
	//wg.Wait()
	//end := time.Now()
	//log.Println(end.Unix() - start.Unix())
	//
	//window.IMShow(mat)
	////tabwindow.IMShow(tab)
	//window.WaitKey(0)







	//w := gocv.NewWindow("w")
	//defer w.Close()
	//origin := gocv.IMRead("./sample-tab-images/tab-3360-2100-1.png", 0)
	//cols := origin.Cols() / (origin.Cols()/ 1024)
	//rows := origin.Rows() / (origin.Cols() / cols)
	//tab := gocv.NewMatWithSize(rows, cols, 0)
	//gocv.Resize(origin, &tab, image.Point{X:cols, Y:rows}, 1, 1, 0)
	//w.IMShow(tab)
	//w.WaitKey(0)

}
