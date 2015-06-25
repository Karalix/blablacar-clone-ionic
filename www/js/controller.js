angular.module('app').controller("SearchController", function($scope,$ionicModal){
	
	
	var viewModel = this;
    viewModel.title = 'Blablacar';
    
    $ionicModal.fromTemplateUrl('connect.html', function(modal) {
		$scope.connectModal = modal;
		}, {scope:$scope, animation:'slide-in-up'});
		
	$ionicModal.fromTemplateUrl('createUser.html', function(modal) {
		$scope.createUserModal = modal;
		}, {scope:$scope, animation:'slide-in-up'});
    
    $scope.lolz = 69 ;
	
	
    viewModel.searchInputStart = '';
    viewModel.searchInputDestination = '';
    viewModel.searchInputDate = '';
	
	viewModel.matchingTrajets = [];
    
    viewModel.connectedUser = null;
	viewModel.loginError = false ;
	viewModel.userAlreadyExists = false ;
    
	//////////////////////////////////////////
	//Listes de données
	//////////////////////////////////////////
    viewModel.users = [
    
		{
			id : 0,
			nom : "José",
			login : "josedu63",
			mdp : "azerty"
		},
		
		{
			id : 1,
			nom : "Marie",
			login : "mariedumas",
			mdp : "1234"
		},
		
		{
			id : 2,
			nom : "Jackie",
			login : "jchan",
			mdp : "0000"
		}
	];
    
    viewModel.trajets = [
		{
			id : 0,
			depart : "Clermont-Ferrand",
			destination : "Paris",
			date : new Date("2015-06-06"),
			chauffeur : 0,
			nbPlaceMax : 4,
			passagers : []
		},
		{
			id : 1,
			depart : "Strasbourg",
			destination : "Nice",
			date : new Date("2015-05-25"),
			chauffeur : 1,
			nbPlaceMax : 1,
			passagers : []
				
		},
		{
			id : 2,
			depart : "Lyon",
			destination : "Brest",
			date : new Date("2015-06-01"),
			chauffeur : 2,
			nbPlaceMax : 3,
			passagers : []
		}
	];
	
	viewModel.ordersList = [
        {
            id: 1,
            title: 'Date ascendante',
            key: 'date',
            reverse: false
        },
        {
            id: 2,
            title: 'Date descendante',
            key: 'date',
            reverse: true
        }
    ];
	
    viewModel.order = viewModel.ordersList[0];
	
	
	//////////////////////////////////////////
	//Fonctions de connection/déconnection
	//////////////////////////////////////////
	viewModel.checkUserExists = function (plogin, pmdp) {
		var foundUser = null ;
		viewModel.users.forEach(function(user) {
			if (user.login == plogin && user.mdp == pmdp){
				 foundUser = user;
			}
		});
		return foundUser;
	};
	
	viewModel.closeConnect = function () {
		$scope.connectModal.hide();
	};
	
	viewModel.connectUser = function (credentials) {
		var user = viewModel.checkUserExists(credentials.login, credentials.mdp);
		if (user != null) {
			viewModel.loginError = false ;
			viewModel.connectedUser = user;
			viewModel.closeConnect() ;
		}
		else {
			viewModel.loginError = true ;
		}
	};
	
	viewModel.deconnectUser = function(){
		viewModel.connectedUser = null ;
	};
	
	viewModel.showConnect = function() {
		$scope.connectModal.show();
	};
	
	//////////////////////////////////////////
	//Fonctions de création de compte
	//////////////////////////////////////////
	
	viewModel.checkLoginExists = function (login) {
		
		var loginAlreadyExists = false ;
		
		viewModel.users.forEach(function(user) {
			if(login == user.login)
			{
				loginAlreadyExists = true ;
			}
		});
		
		return loginAlreadyExists ;
		
	};
	
	viewModel.userInfosAreValid = function (userInfos) {
		if(userInfos.nom == null || userInfos.nom.length < 3) {
			return false ;
		}
		if(userInfos.login == null || userInfos.login.length < 3) {
			return false ;
		}
		if(userInfos.mdp == null || userInfos.mdp.length < 6) {
			return false ;
		}
		if(userInfos.checkMdp != userInfos.mdp) {
			return false ;
		}
		
	};
	
	viewModel.closeCreateUser = function () {
		$scope.createUserModal.hide();
	};
	
	viewModel.createUser = function (credentials) {
		var alreadyExists = viewModel.checkLoginExists(credentials.login);
		
		if (alreadyExists == true ) {
			viewModel.userAlreadyExists = true ;
		}
		else {
			viewModel.loginError = false ;
			
			var newId = 0 ;
			viewModel.users.forEach(function(user) {
				if(user.id >= newId) {
					newId = user.id + 1 ;
				}
			});
			
			var newUser = {
				id : newId,
				nom : credentials.nom,
				login : credentials.login,
				mdp : credentials.mdp
			};
			
			viewModel.users.push(newUser);
			viewModel.closeCreateUser();
		}
	};
	
	viewModel.showCreateUser = function() {
		$scope.createUserModal.show();
	};
	
	//////////////////////////////////////////
	//Fonction de recherche
	//////////////////////////////////////////
	viewModel.fillMatchingTrajets = function () {
		//On vide le tableau de résultats
		viewModel.matchingTrajets.length = 0 ;
		
		viewModel.trajets.forEach(function(trajet) {
			//On vérifie le départ
			var departMatched = false;
			var destinationMatched = false;
			
			if(trajet.depart.toUpperCase().indexOf(viewModel.searchInputStart.toUpperCase()) != -1) {
				departMatched = true ;
			}
			
			if(trajet.destination.toUpperCase().indexOf(viewModel.searchInputDestination.toUpperCase()) != -1) {
				destinationMatched = true ;
			}
			
			if(departMatched && destinationMatched) {
				viewModel.matchingTrajets.push(trajet);
			}
			
		}, this);
		
		
	};
	
	//////////////////////////////////////////
	//Fonction de réservation
	//////////////////////////////////////////
	viewModel.book = function(idTrajet) {
		if (viewModel.connectedUser == null) {
			viewModel.showConnect();
			return;
		}
		var bookedTrajet = null ;
		
		viewModel.trajets.forEach(function(trajet) {
			if (trajet.id == idTrajet) {
				bookedTrajet = trajet ;
			}
		});
		
		if(bookedTrajet == null) {
			return ;
		}
		
		if (bookedTrajet.passagers.indexOf(viewModel.connectedUser.id) === -1) {
			bookedTrajet.passagers.push(viewModel.connectedUser.id);
		}
		
	};
	
	//////////////////////////////////////////
	//Fonctions de gestion des trajets réservés
	//////////////////////////////////////////
	viewModel.getConnectedUserBookedTrajets = function() {
		var bookedTrajets = [] ;
		
		viewModel.trajets.forEach(function(trajet) {
			if(trajet.passagers.indexOf(viewModel.connectedUser.id) != -1 || trajet.chauffeur == viewModel.connectedUser.id) {
				bookedTrajets.push(trajet);
			}
		});
		
		return bookedTrajets ;
	};
	
	//Annulation d'un réservation
	viewModel.unbook = function(idTrajet) {
		
		var bookedTrajet = null ;
		
		viewModel.trajets.forEach(function(trajet) {
			if (trajet.id == idTrajet) {
				bookedTrajet = trajet ;
			}
		});
		
		if(bookedTrajet == null) {
			return ;
		}
		
		var userIndex = bookedTrajet.passagers.indexOf(viewModel.connectedUser.id) ;
		
		bookedTrajet.passagers.splice(userIndex, 1);
	};
	
	//////////////////////////////////////////
	//Récupération d'un user à partir de son ID
	//////////////////////////////////////////
	viewModel.getUser = function(idUser) {
		var foundUser = null ;
		
		viewModel.users.forEach(function(user) {
			if(user.id == idUser) {
				foundUser = user ;
			}
		});
		
		return foundUser ;
	};
	
	//////////////////////////////////////////
	//Création d'un trajet
	//////////////////////////////////////////
	viewModel.createTrajet = function(trajetInformations) {
		var newId = 0 ;
		viewModel.trajets.forEach(function(trajet) {
			if(trajet.id >= newId) {
				newId = trajet.id + 1 ;
			}
		});
		
		var newTrajet = {
			id : newId,
			depart : trajetInformations.depart,
			destination : trajetInformations.destination,
			date : new Date(trajetInformations.date),
			chauffeur : viewModel.connectedUser.id,
			nbPlaceMax : trajetInformations.nbPlaces,
			passagers : []
		};
		
		viewModel.trajets.push(newTrajet);
	};
	
	//////////////////////////////////////////
	//Supression d'un trajet
	//////////////////////////////////////////
	viewModel.cancelTrajet = function(idTrajet) {
		var targetTrajet = null ;
		
		viewModel.trajets.forEach(function(trajet) {
			if(trajet.id == idTrajet) {
				targetTrajet = trajet ;
			}
		});
		
		var trajetIndexTrajets = viewModel.trajets.indexOf(targetTrajet);
		var trajetIndexMatchingTrajets = viewModel.matchingTrajets.indexOf(targetTrajet);
		
		viewModel.trajets.splice(trajetIndexTrajets, 1);
		if(trajetIndexMatchingTrajets != -1) {
			viewModel.matchingTrajets.splice(trajetIndexMatchingTrajets, 1);
		}
		
	};
	
	
});




