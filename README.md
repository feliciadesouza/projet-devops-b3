 projet-devops-b3



&x20;DiabèteTrack



DiabèteTrack est une application web de suivi de glycémie destinée à faciliter la gestion des patients diabétiques.



Le projet met en œuvre une architecture full-stack avec une approche DevOps complète : développement frontend/backend, base de données PostgreSQL, containerisation Docker, pipeline CI/CD GitHub Actions, infrastructure AWS avec Terraform et monitoring.



&x20;Objectifs du projet



\- Développer une application web moderne et fonctionnelle.

\- Créer une API REST sécurisée.

\- Utiliser une base de données PostgreSQL.

\- Mettre en place l’authentification avec JWT.

\- Ajouter des tests automatisés.

\- Containeriser l’application avec Docker.

\- Automatiser l’intégration et le déploiement avec GitHub Actions.

\- Préparer une infrastructure cloud AWS avec Terraform.



&x20;Technologies utilisées



&x20;Frontend



\- React

\- TypeScript

\- CSS



&x20;Backend



\- Node.js

\- Express.js

\- Sequelize

\- JWT

\- bcryptjs



&x20;Base de données



\- PostgreSQL



&x20;DevOps



\- Docker

\- Docker Compose

\- GitHub Actions

\- Terraform

\- AWS ECS

\- AWS RDS

\- AWS ECR

\- CloudWatch



&x20;Fonctionnalités principales



\- Inscription utilisateur

\- Connexion utilisateur

\- Authentification sécurisée avec JWT

\- Gestion des patients

\- Gestion des mesures de glycémie

\- API REST

\- Endpoint de vérification de santé de l’API

\- Base de données PostgreSQL

\- Déploiement prévu sur AWS



&x20;Architecture du projet



Architecture applicative :



&x20;   Utilisateur

&x20;      |

&x20;   Frontend React

&x20;      |

&x20;   API Backend Node.js / Express

&x20;      |

&x20;   Base de données PostgreSQL



Architecture DevOps :



&x20;   GitHub Repository

&x20;      |

&x20;   GitHub Actions CI/CD

&x20;      |

&x20;   Docker Image

&x20;      |

&x20;   AWS ECR

&x20;      |

&x20;   AWS ECS

&x20;      |

&x20;   CloudWatch Logs



&x20;Structure du projet



&x20;   projet-devops-b3/

&x20;   ├── .github/

&x20;   │   └── workflows/

&x20;   ├── docs/

&x20;   ├── infrastructure/

&x20;   │   ├── docker/

&x20;   │   └── terraform/

&x20;   ├── src/

&x20;   │   ├── backend/

&x20;   │   └── frontend/

&x20;   ├── tests/

&x20;   ├── .gitignore

&x20;   └── README.md



&x20;Installation locale



&x20;Prérequis



\- Node.js

\- npm

\- Docker

\- Docker Compose

\- PostgreSQL

\- Git



&x20;Cloner le projet



&x20;   git clone https://github.com/feliciadesouza/projet-devops-b3.git

&x20;   cd projet-devops-b3



&x20;Configuration backend



Créer un fichier `.env` à partir du fichier exemple :



&x20;   cp src/backend/.env.example src/backend/.env



Exemple de variables d’environnement :



&x20;   NODE\_ENV=development

&x20;   PORT=3000



&x20;   DB\_HOST=localhost

&x20;   DB\_PORT=5432

&x20;   DB\_NAME=diabetetrack

&x20;   DB\_USER=postgres

&x20;   DB\_PASSWORD=postgres



&x20;   JWT\_SECRET=change\_me\_in\_production



&x20;Lancement du backend



&x20;   cd src/backend

&x20;   npm install

&x20;   npm start



L’API sera accessible sur :



&x20;   http://localhost:3000



Endpoint de santé :



&x20;   GET /api/health



&x20;Lancement du frontend



&x20;   cd src/frontend

&x20;   npm install

&x20;   npm start



Le frontend sera accessible sur :



&x20;   http://localhost:3000



ou sur le port configuré par React.



&x20;Lancement avec Docker



Depuis la racine du projet :



&x20;   docker compose -f infrastructure/docker/docker-compose.yml up --build



Cette commande permet de lancer :



\- le backend ;

\- le frontend ;

\- la base PostgreSQL.



&x20;API REST



| Méthode | Endpoint | Description | Authentification |

|---|---|---|---|

| GET | `/api/health` | Vérifier l’état de l’API | Non |

| POST | `/api/auth/register` | Inscrire un utilisateur | Non |

| POST | `/api/auth/login` | Connecter un utilisateur | Non |

| GET | `/api/patients` | Lister les patients | Oui |

| POST | `/api/patients` | Créer un patient | Oui |

| GET | `/api/glycemies` | Lister les mesures de glycémie | Oui |

| POST | `/api/glycemies` | Ajouter une mesure de glycémie | Oui |


La documentation OpenAPI complète est disponible dans :

    docs/openapi.yaml

Elle décrit les endpoints d’authentification, de gestion des patients et de gestion des mesures de glycémie.


&x20;Tests



Lancer les tests backend :



&x20;   cd src/backend

&x20;   npm test



Lancer les tests avec couverture :



&x20;   npm run test:coverage



Objectif : atteindre au minimum 70 % de couverture de tests.



&x20;CI/CD



Le projet utilise GitHub Actions pour automatiser :



\- l’installation des dépendances ;

\- l’exécution des tests ;

\- le build du frontend ;

\- la construction des images Docker ;

\- le déploiement vers AWS.



Les workflows sont disponibles dans :



&x20;   .github/workflows/



 Infrastructure AWS avec Terraform

L’infrastructure cloud du projet est décrite avec Terraform dans le dossier :

    infrastructure/terraform/

L’objectif est de provisionner une architecture AWS complète pour exécuter l’application en production.

 Ressources prévues

- VPC dédié pour l’application
- Subnets publics pour le Load Balancer et ECS
- Subnets privés pour la base de données
- Internet Gateway
- Route Table publique
- Security Groups pour ALB, ECS et RDS
- Base de données PostgreSQL avec Amazon RDS
- Repository Docker avec Amazon ECR
- Cluster Amazon ECS
- Service ECS Fargate
- Application Load Balancer
- Target Group avec health check sur `/api/health`
- CloudWatch Log Group pour les logs applicatifs
- IAM Role pour l’exécution des tâches ECS

 Fichiers Terraform

    infrastructure/terraform/main.tf
    infrastructure/terraform/terraform.tfvars.example

Le fichier `terraform.tfvars.example` sert de modèle pour créer un fichier local `terraform.tfvars`.

Exemple :

    aws_region  = "us-east-1"
    db_username = "postgres"
    db_password = "change_me_secure_password"

Le fichier `terraform.tfvars` ne doit pas être envoyé sur GitHub, car il peut contenir des informations sensibles.

 Commandes Terraform

Depuis la racine du projet :

    cd infrastructure/terraform
    terraform init
    terraform fmt
    terraform validate
    terraform plan
    terraform apply

 Déploiement continu AWS

Le pipeline CD est défini dans :

    .github/workflows/cd.yml

Il permet de :

- configurer les identifiants AWS depuis GitHub Secrets ;
- se connecter à Amazon ECR ;
- construire l’image Docker backend ;
- pousser l’image vers ECR ;
- mettre à jour la task definition ECS avec cette image ;
- redéployer le service ECS ;
- (optionnel) construire le frontend et le pousser sur le bucket S3 si la variable `FRONTEND_S3_BUCKET` est définie.

 Secrets GitHub nécessaires

Pour que le déploiement continu fonctionne, les secrets suivants doivent être configurés dans GitHub :

    AWS_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY

Ces secrets ne doivent jamais être écrits directement dans le code.

### Lien à partager après déploiement

Après `terraform apply`, récupérez les URLs :

```bash
cd infrastructure/terraform
terraform output public_app_url    # site React (S3)
terraform output public_api_url    # API (ALB)
terraform output frontend_bucket_name
```

- **Application (à envoyer aux testeurs)** : valeur de `public_app_url` (ex. `http://diabetetrack-frontend-xxxx.s3-website-us-east-1.amazonaws.com`).
- **API seule** : `public_api_url` + chemins `/api/...` (ex. `http://diabetetrack-alb-xxx.elb.amazonaws.com/api/health`).

Pour que le **CD déploie aussi le build React** sur S3 à chaque merge sur `main` :

1. Créez une **variable** de dépôt GitHub (Settings → Secrets and variables → Actions → **Variables**) nommée `FRONTEND_S3_BUCKET` avec la valeur affichée par `terraform output -raw frontend_bucket_name`.
2. Accordez à l’utilisateur IAM utilisé par les secrets `AWS_*` les droits **S3** sur ce bucket (`s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket`, etc.) et **elasticloadbalancing:DescribeLoadBalancers** pour lire le DNS de l’ALB.

Si `FRONTEND_S3_BUCKET` est vide, le CD ne fait que le backend (comme avant) ; l’URL S3 existe quand même après Terraform, mais il faudra uploader le dossier `build/` manuellement ou activer la variable.

L’infrastructure est décrite avec Terraform dans :



&x20;   infrastructure/terraform/



Ressources prévues :



\- VPC

\- Subnets publics et privés

\- Security Groups

\- RDS PostgreSQL

\- ECR

\- ECS Cluster

\- ECS Service

\- Load Balancer

\- CloudWatch Logs

\- Bucket S3 pour le frontend (site statique)



Commandes Terraform :



&x20;   cd infrastructure/terraform

&x20;   terraform init

&x20;   terraform fmt

&x20;   terraform validate

&x20;   terraform plan

&x20;   terraform apply



&x20;Monitoring



Le monitoring est prévu avec :



\- AWS CloudWatch pour les logs ;

\- endpoint `/api/health` pour vérifier l’état de l’API ;

\- métriques applicatives à ajouter selon l’évolution du projet.



&x20;Sécurité



Bonnes pratiques appliquées :



\- mots de passe hashés avec bcrypt ;

\- authentification JWT ;

\- variables sensibles stockées dans `.env` ;

\- fichier `.env` exclu du dépôt Git ;

\- fichier `.env.example` fourni comme modèle ;

\- `node\_modules` exclu du dépôt Git.



&x20;Auteurs



Projet réalisé dans le cadre du Bachelor 3 DevOps.



Auteurs :



\- Felicia de SOUZA

\- Samson KLOUGAN

\- Jonathan AZIAGBEGNON

\- Félicité DONOU

