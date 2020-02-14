package ga

import (
	"sort"
	"strings"
)

func replacement(name string, population []typeChromosome, offspring typeChromosome) []typeChromosome {
	if strings.ToLower(name) == "worst" {
		return replacementWorst(population, offspring)
	} else if strings.ToLower(name) == "best" {
		return replacementBest(population, offspring)
	} else {
		return nil
	}
}

func replacementWorst(population []typeChromosome, offspring typeChromosome) []typeChromosome {
	if offspring.fitness >= population[0].fitness {
		population = append(population[1:], offspring)

		sort.Slice(population, func(i, j int) bool {
			return population[i].fitness < population[j].fitness
		})
	}

	return population
}

func replacementBest(population []typeChromosome, offspring typeChromosome) []typeChromosome {
	if offspring.fitness <= population[len(population)-1].fitness {
		population = append(population[1:], offspring)

		sort.Slice(population, func(i, j int) bool {
			return population[i].fitness < population[j].fitness
		})
	}

	return population
}
