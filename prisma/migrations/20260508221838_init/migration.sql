-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "capacity" INTEGER NOT NULL,
    "sqft" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "img" TEXT NOT NULL,
    "availability" TEXT NOT NULL DEFAULT 'By request',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hostId" TEXT NOT NULL,
    CONSTRAINT "Listing_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "hours" INTEGER NOT NULL,
    "guests" INTEGER NOT NULL,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "useCase" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listingId" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    CONSTRAINT "Booking_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Thread" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookingId" TEXT,
    "listingId" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    CONSTRAINT "Thread_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Thread_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Thread_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Thread_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "threadId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    CONSTRAINT "Message_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Thread_bookingId_key" ON "Thread"("bookingId");
