package ga

import (
	"math/rand"
	"strings"
)

func selection(name string, population []typeChromosome) []typeChromosome {
	if strings.ToLower(name) == "roulette" {
		return selectionRoulette(population)
	} else if strings.ToLower(name) == "tournament" {
		return selectionTournament(population)
	} else {
		return nil
	}
}

func selectionRoulette(population []typeChromosome) []typeChromosome {
	if (len(population) == 0) || (population == nil) {
		return nil
	}

	var sumFitness float64 = 0
	for i := 0; i < len(population); i++ {
		sumFitness = sumFitness + population[i].fitness
	}

	const numParents int = 2
	var parents []typeChromosome = make([]typeChromosome, numParents)
	for i := 0; i < numParents; i++ {
		var point float64 = float64(rand.Intn(int(sumFitness)))
		var sum float64 = 0
		for j := 0; j < len(population); j++ {
			sum = sum + population[j].fitness
			if point < sum {
				parents[i] = population[j]
				break
			}
		}
	}

	return parents
}

func selectionTournament(population []typeChromosome) []typeChromosome {
	if (len(population) == 0) || (population == nil) {
		return nil
	}

	const numParents int = 2
	var parents []typeChromosome = make([]typeChromosome, numParents)

	var temp []typeChromosome = make([]typeChromosome, len(population))
	copy(temp, population)
	for {
		var length = int(len(temp) / 2)
		if length <= 1 {
			break
		}

		var left []typeChromosome = make([]typeChromosome, length)
		var right []typeChromosome = make([]typeChromosome, length)
		copy(left, temp[0:length])
		copy(right, temp[length:2*length])

		for i := 0; i < length; i++ {
			var point int = rand.Intn(100)
			if point <= 60 {
				temp[i] = left[i]
			} else {
				temp[i] = right[i]
			}
		}

		temp = temp[0:length]
	}

	parents[0] = temp[0]
	parents[1] = temp[1]

	return parents
}
