organization := "xieyuheng"
name := "cicada"
version := "0.0.1"
scalaVersion := "2.13.1"

scalacOptions ++= Seq(
  "-deprecation",
  "-encoding", "UTF-8",
  "-unchecked",
  "-feature",
  "-language:higherKinds",
  "-language:implicitConversions",
  "-Xfatal-warnings",
)

libraryDependencies ++= Seq(
  "com.lihaoyi" %% "os-lib" % "0.3.0",
)

enablePlugins(JavaAppPackaging)
publishArtifact in packageDoc := false
publishArtifact in packageSrc := false
