package web
//
//import (
//	"fmt"
//	"gocv.io/x/gocv"
//	"image/color"
//	"log"
//	"os"
//)
//
//const RESIZED_ITEM_IMAGES_PATH = "./resized-item-images/"
//
//func MarkItemByNo(tab gocv.Mat, mat *gocv.Mat, no int) {
//	item := gocv.IMRead(getItemPathByNo(no), 1)
//	defer item.Close()
//
//	cols := tab.Cols() - item.Cols() + 1
//	rows := tab.Rows() - item.Rows() + 1
//	match := gocv.NewMatWithSize(rows, cols, 1)
//	defer match.Close()
//	gocv.MatchTemplate(tab, item, &match, 1, gocv.NewMat())
//	gocv.Normalize(match, &match, 0, 1, 32)
//	mival, maval, miloc, _ := gocv.MinMaxLoc(match)
//	//log.Printf("mival : %v\nmaval : %v\nmiloc : %v\nmaloc : %v\n",
//	//	mival, maval, miloc, maloc)
//	log.Printf("no : %v : %v : %v : %v",no, mival, maval, miloc)
//	if 0 < mival {
//		return
//	}
//
//	red := color.RGBA{R: 255}
//	gocv.Circle(mat, miloc, 10, red, 3)
//}
//
//func getItemPathByNo(no int) string {
//	return fmt.Sprintf("%s%d.png", RESIZED_ITEM_IMAGES_PATH, no)
//}
//
//func IsExistItemByNo(no int) bool {
//	if _, err := os.Stat(getItemPathByNo(no)); os.IsNotExist(err) {
//		return false
//	}
//	return true
//}
