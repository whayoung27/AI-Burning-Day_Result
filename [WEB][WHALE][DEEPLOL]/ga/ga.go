package ga

import (
	"database/sql"
	"fmt"
	"math/rand"
	"os"
	"sort"
	"strconv"
	"strings"
	"sync"

	_ "github.com/lib/pq"
)

type GAResponse struct {
	BestFitness  float64
	WorstFitness float64
	Genes        [][]int
}

// typeChromosome is a structure of chromosome.
type typeChromosome struct {
	genes   []int
	fitness float64
}

var (
	dbHost     = os.Getenv("DB_HOST")
	dbPort     = os.Getenv("DB_PORT")
	dbUser     = os.Getenv("DB_USER")
	dbPassword = os.Getenv("DB_PASSWORD")
	dbName     = os.Getenv("DB_NAME")
)

var numGames int64
var mapWinChampions map[int][]int64

var championIDs []int
var mapChampions map[int]string

func init() {
	var dbInfo string = fmt.Sprintf("host='%s' port='%s' user='%s' password='%s' dbname='%s' sslmode=disable", dbHost, dbPort, dbUser, dbPassword, dbName)
	db, err := sql.Open("postgres", dbInfo)
	if err != nil {
		panic(err.Error())
	}

	var cursor int = 0

	// win_champions
	row := db.QueryRow("SELECT count(*) FROM win_champions")
	row.Scan(&numGames)

	mapWinChampions = make(map[int][]int64)
	rows, err := db.Query("SELECT game_id, my FROM win_champions")
	if err != nil {
		panic(err.Error())
	}
	defer rows.Close()

	cursor = 0
	for rows.Next() {
		var gameID int64
		var my string

		err := rows.Scan(&gameID, &my)
		if err != nil {
			panic(err.Error())
		}

		var champions []string = strings.Split(my, ",")
		for _, champion := range champions {
			key, err := strconv.Atoi(champion)
			if err != nil {
				panic(err.Error())
			}

			_, exists := mapWinChampions[key]
			if !exists {
				mapWinChampions[key] = make([]int64, 0)
			}
			mapWinChampions[key] = append(mapWinChampions[key], gameID)
		}

		cursor = cursor + 1
	}

	// champions
	championIDs = make([]int, 0)
	mapChampions = make(map[int]string)
	rows, err = db.Query("SELECT name, id FROM champions")
	if err != nil {
		panic(err.Error())
	}
	defer rows.Close()

	cursor = 0
	for rows.Next() {
		var name string
		var id int

		rows.Scan(&name, &id)

		championIDs = append(championIDs, id)
		mapChampions[id] = name
		cursor = cursor + 1
	}

	defer db.Close()
}

// calcFitness is function to calculate fitness of chromosome.
func calcFitness(chromosome typeChromosome) float64 {
	if chromosome.genes == nil {
		return -1
	}

	var fitness float64 = 0.
	for i := 0; i < 5; i++ {
		var championID int = chromosome.genes[i]
		_, exists := mapWinChampions[championID]
		if !exists {
			continue
		}

		var count int64 = int64(len(mapWinChampions[championID]))
		fitness = fitness + (float64(count) / float64(numGames) * 100)
	}

	return fitness / float64(5)
}

// initChromosome is function to create and initialize chromosome.
func initChromosome() typeChromosome {
	var chromosome typeChromosome
	chromosome.genes = make([]int, 5)
	chromosome.fitness = -1

	var tempChampionIDs []int = make([]int, len(championIDs))
	copy(tempChampionIDs, championIDs)

	for i := 0; i < 5; i++ {
		var point int = rand.Intn(len(tempChampionIDs))

		chromosome.genes[i] = tempChampionIDs[point]
		tempChampionIDs = append(tempChampionIDs[0:point], tempChampionIDs[point+1:]...)
	}
	chromosome.fitness = calcFitness(chromosome)

	return chromosome
}

// initPopulation is function to create population.
func initPopulation(sizePopulation int) []typeChromosome {
	var wg sync.WaitGroup
	wg.Add(sizePopulation)

	var population []typeChromosome = make([]typeChromosome, sizePopulation)
	for idx := 0; idx < sizePopulation; idx++ {
		go func(idx int) {
			defer wg.Done()
			population[idx] = initChromosome()
		}(idx)
	}

	wg.Wait()

	sort.Slice(population, func(i, j int) bool {
		return population[i].fitness < population[j].fitness
	})

	return population
}

// Run is function ...
func Run(sizePopulation int, numGeneration int) *GAResponse {
	const selectionName string = "roulette"
	const crossoverName string = "pmx"
	const mutationName string = "flip"
	const replacementName string = "worst"

	var population []typeChromosome = initPopulation(sizePopulation)

	// fmt.Println("Worst: ", population[0].fitness, " Best: ", population[sizePopulation-1].fitness)

	for generation := 0; generation < numGeneration; generation++ {
		var parents []typeChromosome = selection(selectionName, population)
		if (len(parents) == 0) || (parents == nil) {
			fmt.Println(selectionName, " is not valid option.")
			return nil
		}

		var offspring typeChromosome = crossover(crossoverName, parents)
		if offspring.genes == nil {
			fmt.Println(crossoverName, " is not valid option.")
			return nil
		}

		offspring = mutation(mutationName, offspring, 0.0001)
		if offspring.genes == nil {
			fmt.Println(mutationName, " is not valid option.")
			return nil
		}

		population = replacement(replacementName, population, offspring)
		if (len(population) == 0) || (population == nil) {
			fmt.Println(replacementName, " is not valid option.")
			return nil
		}

		if population[0].fitness == float64(100) {
			break
		}
	}

	// fmt.Println("Worst: ", population[0].fitness, " Best: ", population[sizePopulation-1].fitness)
	// fmt.Println("Best chromosome: ", population[sizePopulation-1])

	genes := make([][]int, 0)
	for i := 0; i < 5; i++ {
		genes = append(genes, population[sizePopulation-1-i].genes)
	}

	res := GAResponse{
		BestFitness:  population[sizePopulation-1].fitness,
		WorstFitness: population[0].fitness,
		Genes:        genes,
	}
	return &res
}
