export host_uid=$(shell id -u)
export host_gid=$(shell id -g)
export app=halftone

docker_compose_file_app := ./docker/dev/docker-compose.yml
docker_compose_file_traefik := ./docker/dev/traefik/docker-compose.yml
docker_compose_file_proxy := ./docker/dev/docker-compose.proxy.yml
docker_compose_app  := docker-compose -f $(docker_compose_file_app)
docker_compose_traefik  := docker-compose -f $(docker_compose_file_traefik)
docker_compose_proxy  := docker-compose -f $(docker_compose_file_proxy)

is_traefik_running := $(shell docker ps | grep 'traefik')

.PHONY: logs
logs:
	$(docker_compose_app) logs -f

.PHONY: logs-proxy
logs-proxy:
	$(docker_compose_proxy) logs -f

dev: \
		up \
		up-proxy \
		node_modules
	@echo
	@echo "⚙️  Start Dev task"
	@npm run dev

up: \
		up-traefik \
		api_node_modules \
		app_node_modules
	@echo
	@echo "🛫 Starting the platform"
	@echo
	@$(docker_compose_app) up -d
	@echo
	@echo "DONE 🚀 Platform started"
	@echo

up-proxy: \
		up-traefik
	@echo "🛫 Starting the platform"
	@echo
	@$(docker_compose_proxy) up -d
	@echo
	@echo "DONE 🚀 Platform started"
	@echo

.PHONY: down-proxy
down-proxy:
	@echo "🛬 Stopping the platform"
	@echo
	@$(docker_compose_proxy) down
	@echo
	@echo "DONE 🛩  Platform stopped"
	@echo

up-traefik:
	@echo
	@if ! [ -n "$(is_traefik_running)" ]; then \
		echo "🎡 Starting Treafik for proxy" && \
			$(docker_compose_traefik) up -d && \
			echo "DONE 🎡 proxy started" && echo; \
	fi

.PHONY: down-traefik
down-traefik:
	@$(docker_compose_traefik) down

down: down-proxy
	$(docker_compose_app) down

node_modules: package.json
	@echo
	@echo "📦 Install packages root folder"
	@echo
	@npm install
	@npx lerna bootstrap
	@echo
	@echo "DONE 📦 Install packages for root project"
	@echo

%_node_modules:
	@echo
	@echo "📦 Install packages for $*"
	@echo
	@time $(docker_compose_app) run --rm $* npm install
	@echo
	@echo "DONE 📦 Install packages for $*"
	@echo
