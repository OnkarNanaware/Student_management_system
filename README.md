# Smart Campus Complaint & Service System

HTML + CSS + JavaScript

Backend:
Python Flask REST API

Database:
SQLite

DevOps:
Git
GitHub Actions
Docker
Kubernetes
Minikube
Prometheus
Grafana


## Local Run

python -m venv venv

Windows:

.\venv\Scripts\Activate.ps1

pip install -r requirements.txt

python run.py

Open:

http://localhost:5000


## Health

http://localhost:5000/health


## Metrics

http://localhost:5000/metrics


## Tests

pytest -v


## Docker

docker build -t campus-app:v1 .

docker run -d --name campus-app -p 5000:5000 campus-app:v1


## Minikube

minikube start

docker build -t campus-app:v1 .

minikube image load campus-app:v1

kubectl apply -f k8s/

kubectl get pods

kubectl get services

minikube service campus-service


## Scaling

kubectl scale deployment campus-app --replicas=5

kubectl get pods


## Troubleshooting

Change:

image: campus-app:v1

to:

image: campus-app:wrong

Then:

kubectl apply -f k8s/deployment.yaml

kubectl get pods

kubectl describe pod <pod-name>

kubectl get events

Fix the image and apply again.


## Prometheus

kubectl apply -f monitoring/prometheus.yaml

kubectl port-forward service/prometheus 9090:9090

Open:

http://localhost:9090

Query:

up


## Grafana

kubectl apply -f monitoring/grafana.yaml

kubectl port-forward service/grafana 3000:3000

Open:

http://localhost:3000

Prometheus datasource:

http://prometheus:9090


## DevOps Pipeline

Git
 ↓
GitHub Actions
 ↓
Docker
 ↓
Kubernetes
 ↓
Prometheus
 ↓
Grafana
