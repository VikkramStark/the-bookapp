cd lib-man
bun install
bunx expo start



last working firebase rules

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && (
        request.auth.uid == userId || // User can update their own document
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' // Admin can update any user
      );
    }
    match /books/{bookId} {
      allow read: if true;
      allow write: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
        (resource.data.borrowedBy == request.auth.uid && isReturningBook())
      );
    }
    match /requests/{requestId} {
      allow read: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
        resource.data.userId == request.auth.uid
      );
      allow write: if request.auth != null;
    }
    function isReturningBook() {
      return request.resource.data.status == 'available'
             && request.resource.data.borrowedBy == null
             && request.resource.data.borrowedAt == null
             && request.resource.data.returnDays == 0
             && (!('returnDate' in request.resource.data) || request.resource.data.returnDate == null);
    }
  }
}