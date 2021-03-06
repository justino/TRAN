var config = {
    // Game Window Metrics
    width: 800,
    height: 600,
    unitSize: 16,
    discSize: 4, // Should be divisible by 2

    gameStartTime: 2,

    // Units
    enemyCount: 3,
    respawnInterval: 5, // Seconds
    minimumDistance: 250,

    // Game Play Params
    discReturnTime: 1000,  // Seconds
    discSpeed: 4,
    whiteDiscPercent: 20, // Percentage for when a white disc appears
    warriorAccuracy: 85, // Percent
    bulldogAccuracy: 90, // Percent
    leaderAccuracy: 95, // Percent
    regenerationTime: 6, // Seconds

    // Colors
    gridColor: 'rgba(130, 130, 130, 1)',
    tranColor: 'rgba(255, 0, 0, 1)',
    warriorColor: 'rgba(97, 170, 200, 1)',
    bulldogColor: 'rgba(255, 0, 255, 1)',
    leaderColor: 'rgba(0, 127, 255, 1)',
    guardColor: 'rgba(255, 255, 127, 1)'

    // Debuging Params
};
