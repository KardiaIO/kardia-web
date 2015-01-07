// describe('APIController', function () {
//   var $httpBackend, $rootScope, $controller, $state, createController, generateKey, APIController;
//   // set up the module 
//   beforeEach(module('ui.router'));
//   beforeEach(module('ekg.auth'));
//   beforeEach(module('ekg.api'));

//   beforeEach(inject(function($injector, _$httpBackend_, _$rootScope_, _$state_, _Auth_, _$window_, _$controller_){
//     $httpBackend = _$httpBackend_;
//     generateKey = $httpBackend.when('GET', '/api/keys')
//                             .respond({data: {id: 'API Key', secret: 'SecureID'} });
//     // get hold of a scope and state
//     $rootScope = _$rootScope_;
//     $state = _$state_;
//     Auth = _Auth_;
//     $window = _$window_;
//     // the controller service is used to create instances of controllers
//     $controller = _$controller_;

//     createController = function () {
//       return $controller('APIController', {
//         '$scope': $rootScope, 
//         '$window': $window,
//         '$state': $state,
//         'Auth': Auth
//       });
//     };
//   }));

//   afterEach(function () {
//     $httpBackend.verifyNoOutstandingExpectation();
//     $httpBackend.verifyNoOutstandingRequest();
//   });

//   it('Should generate API key', function () {
//     var controller = createController();
//     $httpBackend.expectGET('/api/keys');
//     $rootScope.$digest();
//     expect($rootScope.generated).to.be.true;
//     // expect($rootScope.APIkey).to.equal('API Key');
//     // expect($rootScope.SecureID).to.equal('SecureID');
//   });

// });