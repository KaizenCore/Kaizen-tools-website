export interface BodyPartRotation {
    x: number;
    y: number;
    z: number;
}

export interface ArmorStandPose {
    id: string;
    name: string;
    description: string;
    rotations: {
        head: BodyPartRotation;
        body: BodyPartRotation;
        leftArm: BodyPartRotation;
        rightArm: BodyPartRotation;
        leftLeg: BodyPartRotation;
        rightLeg: BodyPartRotation;
    };
}

export interface BodyPartLimits {
    min: number;
    max: number;
}

export const bodyPartLimits: BodyPartLimits = {
    min: -180,
    max: 180,
};

export const defaultPose: ArmorStandPose = {
    id: 'default',
    name: 'Default',
    description: 'Standard armor stand pose',
    rotations: {
        head: { x: 0, y: 0, z: 0 },
        body: { x: 0, y: 0, z: 0 },
        leftArm: { x: 0, y: 0, z: 0 },
        rightArm: { x: 0, y: 0, z: 0 },
        leftLeg: { x: 0, y: 0, z: 0 },
        rightLeg: { x: 0, y: 0, z: 0 },
    },
};

export const armorStandPresets: ArmorStandPose[] = [
    defaultPose,
    {
        id: 't-pose',
        name: 'T-Pose',
        description: 'Arms stretched out horizontally',
        rotations: {
            head: { x: 0, y: 0, z: 0 },
            body: { x: 0, y: 0, z: 0 },
            leftArm: { x: 0, y: 0, z: -90 },
            rightArm: { x: 0, y: 0, z: 90 },
            leftLeg: { x: 0, y: 0, z: 0 },
            rightLeg: { x: 0, y: 0, z: 0 },
        },
    },
    {
        id: 'walking',
        name: 'Walking',
        description: 'Mid-stride walking pose',
        rotations: {
            head: { x: 0, y: 0, z: 0 },
            body: { x: 0, y: 0, z: 0 },
            leftArm: { x: -30, y: 0, z: 0 },
            rightArm: { x: 30, y: 0, z: 0 },
            leftLeg: { x: 30, y: 0, z: 0 },
            rightLeg: { x: -30, y: 0, z: 0 },
        },
    },
    {
        id: 'running',
        name: 'Running',
        description: 'Fast running pose',
        rotations: {
            head: { x: 10, y: 0, z: 0 },
            body: { x: 15, y: 0, z: 0 },
            leftArm: { x: -60, y: 0, z: 0 },
            rightArm: { x: 60, y: 0, z: 0 },
            leftLeg: { x: 60, y: 0, z: 0 },
            rightLeg: { x: -60, y: 0, z: 0 },
        },
    },
    {
        id: 'sitting',
        name: 'Sitting',
        description: 'Seated position',
        rotations: {
            head: { x: 0, y: 0, z: 0 },
            body: { x: 0, y: 0, z: 0 },
            leftArm: { x: -80, y: 0, z: 0 },
            rightArm: { x: -80, y: 0, z: 0 },
            leftLeg: { x: -90, y: 0, z: 0 },
            rightLeg: { x: -90, y: 0, z: 0 },
        },
    },
    {
        id: 'waving',
        name: 'Waving',
        description: 'Friendly wave gesture',
        rotations: {
            head: { x: 0, y: 15, z: 0 },
            body: { x: 0, y: 10, z: 0 },
            leftArm: { x: 0, y: 0, z: 0 },
            rightArm: { x: -110, y: 30, z: 0 },
            leftLeg: { x: 0, y: 0, z: 0 },
            rightLeg: { x: 0, y: 0, z: 0 },
        },
    },
    {
        id: 'pointing',
        name: 'Pointing',
        description: 'Pointing forward',
        rotations: {
            head: { x: 0, y: 0, z: 0 },
            body: { x: 0, y: 0, z: 0 },
            leftArm: { x: 0, y: 0, z: 0 },
            rightArm: { x: -90, y: 10, z: 0 },
            leftLeg: { x: 0, y: 0, z: 0 },
            rightLeg: { x: 0, y: 0, z: 0 },
        },
    },
    {
        id: 'saluting',
        name: 'Saluting',
        description: 'Military salute',
        rotations: {
            head: { x: 0, y: 0, z: 0 },
            body: { x: 0, y: 0, z: 0 },
            leftArm: { x: 0, y: 0, z: 0 },
            rightArm: { x: -110, y: 0, z: 80 },
            leftLeg: { x: 0, y: 0, z: 0 },
            rightLeg: { x: 0, y: 0, z: 0 },
        },
    },
    {
        id: 'dabbing',
        name: 'Dabbing',
        description: 'The dab pose',
        rotations: {
            head: { x: 0, y: -40, z: -20 },
            body: { x: 0, y: 0, z: 0 },
            leftArm: { x: -110, y: 50, z: 0 },
            rightArm: { x: -30, y: -30, z: 70 },
            leftLeg: { x: 0, y: 0, z: 0 },
            rightLeg: { x: 0, y: 0, z: 0 },
        },
    },
    {
        id: 'blocking',
        name: 'Blocking',
        description: 'Defensive blocking stance',
        rotations: {
            head: { x: 0, y: 0, z: 0 },
            body: { x: 0, y: 0, z: 0 },
            leftArm: { x: -40, y: 30, z: -10 },
            rightArm: { x: -40, y: -30, z: 10 },
            leftLeg: { x: 10, y: 0, z: 0 },
            rightLeg: { x: -10, y: 0, z: 0 },
        },
    },
    {
        id: 'celebrating',
        name: 'Celebrating',
        description: 'Victory celebration',
        rotations: {
            head: { x: -10, y: 0, z: 0 },
            body: { x: 0, y: 0, z: 0 },
            leftArm: { x: -140, y: 0, z: -20 },
            rightArm: { x: -140, y: 0, z: 20 },
            leftLeg: { x: 0, y: 0, z: 0 },
            rightLeg: { x: 0, y: 0, z: 0 },
        },
    },
    {
        id: 'thinking',
        name: 'Thinking',
        description: 'Thoughtful pose',
        rotations: {
            head: { x: -10, y: 20, z: 0 },
            body: { x: 0, y: 0, z: 0 },
            leftArm: { x: 0, y: 0, z: 0 },
            rightArm: { x: -90, y: 20, z: 80 },
            leftLeg: { x: 0, y: 0, z: 0 },
            rightLeg: { x: 0, y: 0, z: 0 },
        },
    },
    {
        id: 'attention',
        name: 'At Attention',
        description: 'Military attention stance',
        rotations: {
            head: { x: 0, y: 0, z: 0 },
            body: { x: 0, y: 0, z: 0 },
            leftArm: { x: 0, y: 0, z: 2 },
            rightArm: { x: 0, y: 0, z: -2 },
            leftLeg: { x: 0, y: 0, z: -1 },
            rightLeg: { x: 0, y: 0, z: 1 },
        },
    },
];

export const bodyPartNames = {
    head: 'Head',
    body: 'Body',
    leftArm: 'Left Arm',
    rightArm: 'Right Arm',
    leftLeg: 'Left Leg',
    rightLeg: 'Right Leg',
} as const;

export type BodyPartKey = keyof typeof bodyPartNames;
