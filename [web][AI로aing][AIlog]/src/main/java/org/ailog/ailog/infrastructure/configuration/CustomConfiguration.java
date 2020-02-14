package org.ailog.ailog.infrastructure.configuration;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
		basePackages = "org.ailog.ailog.infrastructure.persistence",
		entityManagerFactoryRef = "entityManagerFactory",
		transactionManagerRef = "jpaTransactionManager"
)
public class CustomConfiguration {

	@Bean
	public CommonsMultipartResolver commonsMultipartResolver() {
		final CommonsMultipartResolver commonsMultipartResolver = new CommonsMultipartResolver();
		commonsMultipartResolver.setMaxUploadSize(100000000L);
		return commonsMultipartResolver;
	}

	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}

	@Bean
	@ConfigurationProperties(prefix = "spring.datasource.hikari")
	public DataSource dataSource() {
		return DataSourceBuilder.create().build();
	}

	@Bean
	public LocalContainerEntityManagerFactoryBean entityManagerFactory(EntityManagerFactoryBuilder factoryBuilder) {
		return factoryBuilder.dataSource(dataSource())
				.packages("org.ailog.ailog.domain.model")
				.build();
	}

	@Bean
	public PlatformTransactionManager jpaTransactionManager(@Qualifier("entityManagerFactory")EntityManagerFactory entityManagerFactory) {
		return new JpaTransactionManager(entityManagerFactory);
	}

}
