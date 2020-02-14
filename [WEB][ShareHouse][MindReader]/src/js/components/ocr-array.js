export function ocrToArray(data){
	const datas = JSON.parse(data)
	const array = datas.images[0].fields.map(element => element.inferText)
    
	// console.log(`#20 PR Test`, array)
    
	return array //배열 넘김
}
