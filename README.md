# No Strings Attached

## Inspiration
Technology is amazing. The ability to explore countless web pages and message someone across the globe is right at our fingertips. In spite of the constant buzz of technology, a subtle yet significant issue persists: loneliness. It's a paradox of our times — a world more interconnected than ever, yet tinged with a pervasive sense of isolation.

Enter “No Strings Attached”, our hackathon creation. Our project aims to harness technology to foster connections and combat social isolation. Drawing inspiration from interactive games like Kahoot, our objective was to craft a social gaming experience where multiple players could actively participate using their smartphones to engage with content displayed on a central screen.

## What it does
"No Strings Attached" is an engaging co-op game designed for two players. In this unique experience, participants take on the role of puppeteers, wielding control over their puppets through the intuitive interface of their mobile devices. The gameplay involves manipulating the movement of the puppets by skillfully tilting their phones and interacting with in-game objects using gestures in the air. In order to clear all of the challenges, it is imperative that players coordinate their efforts and communicate their intentions.

## How we built it
In order to accurately track the orientation and position of the mobile device, we used the THREE.js library to store and manipulate quaternions, a mathematical representation of orientation that does not carry the risk of singularities. These quaternions were used to transform measurements taken relative to the gyroscope and accelerometer to absolute measurements based on a set of axes determined during calibration. To clean and filter the noisy sensor data, we implemented a low and high pass to exclude outliers in addition to a  moving arithmetic mean. 

The positional data processed from the sensors was then fed into $Q to obtain point clouds which we converted into symbols. We also used Socket.IO to allow for communication between the main screen, phones, and server.  We built our own pendulum physics and animations, and created our own line-drawn sprites.

## Challenges we ran into
We initially had significant issues with noise in the acceleration data, causing heavy drift in the calculated velocities over time. Calibrating the accelerometer and improving the accuracy with which we identified shapes from sets of points were both difficult tasks.

## Accomplishments that we're proud of
We were able to make the characters move according to the phones’ tilt, and incorporate the mechanic into a playable demonstration! We are also proud of our smooth physics simulation of the limbs as the puppets move, as well as the canvas line art, especially mini Snorlax!  

## What we learned
A lot of linear algebra, quaternions, and rotations
Sensors can be extremely difficult to deal with, especially when multiple measurements are added up over time.
Quaternions can be used to represent rotations and make many operations on rotations a lot easier.

## What's next for No Strings Attached
Improvements all around! If we had more time, we would have hoped to improve our process for identifying gestures. 
