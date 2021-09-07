/*
 * @Author: bowentang
 * @Date: 2021-08-27 15:25:32
 * @LastEditTime: 2021-08-27 19:19:30
 * @FilePath: /draw_ts/src/ts/renderTreeSchema.ts
 * @Description:
 */
// 节点类型
export type NodeType = 'QText' | 'QImage' | 'QLayer' | 'QBody';
// 定位类型
export type PositionType = 'absolute' | 'relative' | 'fixed';
// 展示类型
export type DisplayType = 'flex' | 'inline';
// flex类型 Direction扩展
export type FlexDirectionType = 'row' | 'column';
// flex类型 justifyContent扩展
export type JustifyContentType = 'start' | 'center' | 'end' | 'between' | 'around';
// flex类型 alignItems扩展
export type AlignItemsType = 'top' | 'center' | 'bottom' | 'between' | 'around';


// 节点描述
export interface NodeSchema {
  // id
  id: string;
  // 节点组件名称
  nodeType: NodeType;
  // 节点坐标尺寸
  rect?: Rect;
  // 节点样式属性
  props?: NodeProps;
  // 子节点
  children?: NodeSchema[];
  // 子节点循环
  childrenLoop?: boolean; // (讨论)
  // 特性
  features?: Features;
}

// 节点 Rect 坐标、尺寸描述
export interface Rect {
  x: number;
  y: number;
  width: number;
  height?: number;
}

// 节点 Props
export interface NodeProps {
  // 节点样式
  style?: {
    // position
    position?: PositionType;
    // x
    x?: number;
    // y
    y?: number;
    // width
    width?: number;
    // height
    height?: number;
    // display
    display?: DisplayType;
    // padding
    padding?: Padding;
    // margin
    margin?: Margin;
    // lineHeight
    lineHeight?: number;
    // opacity
    opacity?: number;
    // borderRadius
    borderRadius?: BorderRadius;
    // linearGradient
    linearGradient?: LinearGradient;
    // RadiusGradient
    radiusGradient?: RadiusGradient;
    // flexLayout
    flexLayout?: {
      // direction
      flexDirection: FlexDirectionType;
      // justifyContent
      justifyContent: JustifyContentType;
      // alignItems
      alignItems: AlignItemsType;
    };
    // fontSize
    fontSize?: number;
    // fontColor
    fontColor?: Color;
    // backgroundColor
    backgroundColor?: Color;
    [key: string]: any;
  };
  // 图片
  src?: string;
  // 文本
  text?: string;
  // class类名
  className?: string;
  // id
  id?: string;
}

// 节点特征，是否循环，成组，组件特征等
export interface Features {// （待讨论）
  // 循环
  repeat: {
    repeatId: number;
    repeatIndex: number;
  };
  // 成组
  group: {
    groupId: number;
  };
  // 组件化类型
  componentType: string[];  // ['button','list','banner']
}

// --------------细化style---------------
// color  rgba
export interface Color {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

// padding
export interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// margin
export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// borderRadius
export interface BorderRadius {
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
  topLeft: number;
}

// color Stop
export interface ColorStop {
  stopValue: number;
  color: Color;
}

// linearGradient
export interface LinearGradient {
  directionAngle?: number;
  colorStops: ColorStop[];
}

// radiusGradientPosition
export interface RadiusGradientPosition {
  x: number;
  y: number;
}

// radiusGradient
export interface RadiusGradient {
  position?: RadiusGradientPosition;
  colorStops: ColorStop[];
}


