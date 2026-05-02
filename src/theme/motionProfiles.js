export const motionProfiles = {
    material: {
        easing: { easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)", sharp: "cubic-bezier(0.4, 0, 0.6, 1)" },
        duration: { short: 200, standard: 300 },
    },
    apple: {
        easing: { easeInOut: "cubic-bezier(0.25, 0.1, 0.25, 1)", sharp: "cubic-bezier(0.33, 1, 0.68, 1)" },
        duration: { short: 300, standard: 500 },
    },
    fluent: {
        easing: { easeInOut: "cubic-bezier(0.55, 0, 0.1, 1)", sharp: "cubic-bezier(0, 0, 0, 1)" },
        duration: { short: 150, standard: 250 },
    },
};

export const getMotionProfile = (system) => motionProfiles[system] || motionProfiles.material;