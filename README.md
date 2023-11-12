# No Strings Attached

## Inspiration
Technology is amazing. The ability to explore countless web pages and message someone across the globe is right at our fingertips. In spite of the constant buzz of technology, a subtle yet significant issue persists: loneliness. It's a paradox of our times — a world more interconnected than ever, yet tinged with a pervasive sense of isolation.

Enter “No Strings Attached”, our hackathon creation. Our project aims to harness technology to foster connections and combat social isolation. Drawing inspiration from interactive games like Kahoot, our objective was to craft a social gaming experience where multiple players could actively participate using their smartphones to engage with content displayed on a central screen.

## What it does
"No Strings Attached" is an engaging co-op game designed for two players. In this unique experience, participants take on the role of puppeteers, wielding control over their puppets through the intuitive interface of their mobile devices. The gameplay involves manipulating the movement of the puppets by skillfully tilting their phones and interacting with in-game objects using gestures in the air. In order to clear all of the challenges, it is imperative that players coordinate their efforts and communicate their intentions.

## How we built it
To accurately monitor the orientation and position of each mobile device, we used the THREE.js library, utilizing quaternions as a robust mathematical representation of orientation that avoids singularities. Using these quaternions, we transformed data obtained from the gyroscope and accelerometer—originally relative measurements—into absolute measurements based on a predefined set of axes established during a calibration period.

The processed positional data from the sensors was then channeled into $Q (“Q-dollar”) to generate point clouds, which were then recognized as symbols. Our system's communication infrastructure was facilitated by Socket.IO, enabling seamless interaction between the main screen, phones, and the server. Additionally, we took a hands-on approach by constructing our own pendulum physics and animations with canvas, and developing custom line-drawn sprites to create a unique visual experience.

## Challenges we ran into
We initially had significant issues with noise in the acceleration data, causing heavy drift in the calculated velocities over time. Calibrating the accelerometer and improving the accuracy with which we identified shapes from sets of points were both difficult tasks. Ultimately, to enhance the accuracy of our sensor data, we implemented both low and high pass filters, excluding outliers, and incorporated a moving arithmetic mean to mitigate noise. 

The manual creation of a game interface posed a significant challenge, particularly in addressing a complex class definition problem during the initial stages of designing the game framework. Overcoming this obstacle required careful consideration and strategic problem-solving to ensure a smooth development process.


## Accomplishments that we're proud of
We successfully transformed an initially subpar experience into fluid gameplay where character movements align with the tilt of the phones, integrating the mechanic into a playable demonstration. In addition, we crafted a fluid physics simulation that brings a natural quality to the puppets' limb movements. Our pride also extends to the hand-coded canvas art, featuring the adorable mini Snorlax, which contributes greatly to the overall visual appeal of our project.

## What we learned
Dealing with sensor drift and a phenomenon known as gimbal lock turned out to be quite a puzzle, particularly when dealing with multiple measurements over time. To resolve this, we learned a significant amount about basic signal processing as well as how to use quaternions to represent orientation. This approach significantly improved the performance of successive rotations compared to representations like axis angle and Euler angles.

## What's next for No Strings Attached
Improvements all around! Given additional time, we aspire to refine our gesture recognition process, aiming to identify and incorporate more complex gestures into the gameplay. Expanding the variety of levels is also on our radar to offer players a more diverse and challenging progression. Additionally, to elevate the overall polish and sophistication of the game, we would like to explore the possibility of implementing physics within a dedicated game engine like Unity, to ensure a seamless and more immersive gaming experience.
