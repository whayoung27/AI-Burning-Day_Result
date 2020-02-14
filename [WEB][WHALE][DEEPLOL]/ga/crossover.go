package ga

import (
	"math/rand"
	"strings"
)

func crossover(name string, parents []typeChromosome) typeChromosome {
	if strings.ToLower(name) == "onepoint" {
		return crossoverOnePoint(parents)
	} else if strings.ToLower(name) == "uniform" {
		return crossoverUniform(parents)
	} else if strings.ToLower(name) == "pmx" {
		return crossoverPMX(parents)
	} else {
		return typeChromosome{nil, -1}
	}
}

func crossoverOnePoint(parents []typeChromosome) typeChromosome {
	var point int = rand.Intn(5)

	var offspring typeChromosome
	offspring.genes = append(parents[0].genes[:point], parents[1].genes[point:]...)
	offspring.fitness = calcFitness(offspring)

	return offspring
}

func crossoverUniform(parents []typeChromosome) typeChromosome {
	var probability []int = make([]int, 5)
	for i := 0; i < 5; i++ {
		probability[i] = rand.Intn(100)
	}

	var offspring typeChromosome
	offspring.genes = make([]int, 5)
	for i := 0; i < 5; i++ {
		if probability[i] <= 50 {
			offspring.genes[i] = parents[0].genes[i]
		} else {
			offspring.genes[i] = parents[1].genes[i]
		}
	}
	offspring.fitness = calcFitness(offspring)

	return offspring
}

func crossoverPMX(parents []typeChromosome) typeChromosome {
	var point1 int = 1
	var point2 int = 2 + rand.Intn(2)

	var offspring typeChromosome
	var part1 []int = parents[1].genes[:point1]
	var part2 []int = parents[0].genes[point1:point2]
	var part3 []int = parents[1].genes[point2:]

	var temp1 []int = parents[0].genes[:point1]
	var temp3 []int = parents[0].genes[point2:]

	for i := 0; i < len(part1); i++ {
		for j := 0; j < len(part2); j++ {
			if part1[i] == part2[j] {
				part1[i] = temp1[i]
				break
			}
		}
	}

	for i := 0; i < len(part3); i++ {
		for j := 0; j < len(part2); j++ {
			if part3[i] == part2[j] {
				part3[i] = temp3[i]
				break
			}
		}
	}

	offspring.genes = append(part1, part2...)
	offspring.genes = append(offspring.genes, part3...)
	offspring.fitness = calcFitness(offspring)

	return offspring
}
