# Deploy pod
microk8s kubectl apply -f ./k8s/deployment/tldraw-server.yaml
microk8s kubectl apply -f ./k8s/deployment/tldraw-client.yaml

# Deploy service
microk8s kubectl apply -f ./k8s/service/tldraw-server.yaml
microk8s kubectl apply -f ./k8s/service/tldraw-client.yaml

# Deploy Gateway
microk8s enable ingress
microk8s kubectl apply -f ./k8s/ingress/ingress.yaml

# Deploy auto scaler
microk8s enable metrics-server
microk8s kubectl apply -f ./k8s/scaler/tldraw-server.yaml